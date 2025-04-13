import { log, Timestamp, Flags, MercyUtil } from '../../../../utility/index.js'
import { Session }                          from './session.js';
import { AccountCache }                     from './cache.js';


class AccountManager
{
    constructor(member)
    {
        this.tracker    = member.manager.tracker
        this.registry   = member.manager.tracker.registry;
        this.database   = member.manager.tracker.database;

        this.cache      = new AccountCache(this.registry, member);

        this.member     = member;
        this.active     = null;

        this.loadAccounts();
    }

    // Standard

    create(accountName, main)
    {
        log.debug(`Creating new account '${accountName}'`);

        this.database.createAccount(this.member, accountName, main);
        this.loadAccount(accountName);
    }

    delete(accountName)
    {
        log.debug(`Deleting account '${accountName}'`);

        this.database.deleteAccount(this.member, accountName);
        this.cache.delete(accountName);
        this.member.accounts = this.member.accounts.filter((account) => account != accountName);
    }

    get(accountName)
    {
        if (accountName)
        {
            return this.cache.get(accountName);
        }
        return this.cache.find((account) => account.main);
    }

    // Load Account

    loadAccounts()
    {
        log.debug(`Loading ${this.member.member}'s accounts`)

        this.database.getAccounts(this.member).forEach((account) => 
        {
            this.loadAccount(account.account);
        })
    }

    loadAccount(accountName)
    {
        log.trace(`Loading account '${accountName}'`)

        const account = new Account(
            this,
            this.database.loadAccountProfile(this.member, accountName),
            this.database.loadAccountData   (this.member, accountName),
            this.database.loadAccountSession(this.member, accountName)
        );

        if (!this.member.accounts.includes(accountName)) 
        {
            this.member.accounts.push(accountName);
        }        

        this.cache.set(account);
    }

    // Update Account

    async updateAccounts()
    {
        log.debug(`Updating ${this.member.member}'s accounts`);

        for (const account of this.cache.values()) 
        {
            await this.updateAccount(account);
        }

        log.debug(`Successfully updated ${this.member.member}'s accounts`);
    }

    async updateAccount(account)
    {
        log.trace(`Updating account '${account.account}'`);

        await Promise.all([
            this.database.updateAccount(account),
            this.database.updateAccountMercy(account),
            this.database.updateAccountSession(account),
            this.database.updateAccountLogs(account)
        ]);

        account.flag.account.dirty.clear()
    }

    // Active account

    setActive(account)
    {
        this.active = account;
    }

    getActive()
    {
        return this.active;
    }

    clearActive()
    {
        this.active = null;
    }

    // Feed

    allAccountsFeed()
    {
        const feed = []

        for (const [key, account] of this.cache)
        {
            feed.push(...this.accountFeed(account));
        }

        feed.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        return feed
    }

    accountFeed(account)
    {
        const data = this.database.getAccountLogs(account);
        const feed = []

        feed.push({log: `${Timestamp.session(account.registered)}: ${account.member} created account ${account.account}`, timestamp: account.registered})

        for (const [type, array] of Object.entries(data))
        {
            for (const entry of array)
            {
                feed.push(format[type](entry))
            }
        }
        feed.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        return feed;
    }


}

const format =
{
    pull:       (entry) => { return {log: `${entry.session}: ${entry.account} pulled ${entry.count} ${entry.shard} ${entry.count == 1 ? 'shard' : 'shards'}`,    timestamp: entry.timestamp }},
    reset:      (entry) => { return {log: `${entry.session}: ${entry.account} reset ${entry.shard} shards on shard ${entry.total}`,                             timestamp: entry.timestamp }},
    champion:   (entry) => { return {log: `${entry.session}: ${entry.account} pulled ${entry.rarity} champion ${entry.champion}`,                                timestamp: entry.timestamp }}
}



class Account 
{
    constructor(manager, profile, mercy, session)
    {
        this.manager    = manager;

        this.id         = profile.id;
        this.member     = profile.member;
        this.account    = profile.account;
        this.main       = !!profile.main;

        this.data       = new AccountData       (profile.data);
        this.settings   = new AccountSettings   (profile.settings);
        this.flag       = new AccountFlags      (profile.flags)
        this.mercy      = new AccountMercy      (this, mercy);
        this.session    = new Session           (this, session);

        this.lastActive = Timestamp.iso();
        this.registered = profile.registered;

        log.debug(`Instantiated ${this.member}'s account '${this.account}'`);
    }

    pull(shard, count)
    {
        this.validateSession();

        this.session.logPull(shard, count);
        this.mercy  .pull(shard, count);

        this.flag.account.dirty.set();
    }

    reset(shard, rarity, champion)
    {
        this.validateSession();

        this.session.logReset(shard, rarity, champion, this.mercy[shard][rarity].total);
        this.session.logChampion(shard, rarity, champion, this.mercy[shard][rarity].total);

        this.mercy.reset(shard, rarity);
        this.mercy.lastChampion(champion)

        this.flag.account.dirty.set();
    }

    log(source, rarity, champion, count)
    {
        this.validateSession();

        
        if (MercyUtil.isShard(source))
        {
            this.mercy.lastChampion(source, rarity, champion)
            this.session.logChampion(source, rarity, champion, total)
        }
        else
        {
            this.session.logSourceChampion(source, rarity, champion, count);
        }

        this.flag.account.dirty.set();
    }

    validateSession()
    {
        if (!this.session.valid())
        {
            this.session.refresh();
            this.mercy  .refresh();
        }
    }

    setActive()
    {
        this.tracker.memberManager.cache.get({ id:this.id, user: { username: this.member }}).account.setActive(this);
    }

    update()
    {
        this.manager.updateAccount(this);
    }
}


class AccountData
{
    constructor(data)
    {
        this.template = data?.template ||
        {   
            selection:
            {
                static:         ['wukong'],
                rotate:         [],
                custom:         [],
            },
        }
    }
}


class AccountSettings
{
    constructor(data)
    {
        this.template = 
        {   
            options: Flags.from(data?.template?.options,
            {   
                static:         true,
                rotate:         false,
                random:         false,
                custom:         false,
                text:           false,
            }),

            display: Flags.from(data?.template?.display,
            {
                total:          true,
                mercy:          true,
                lastAdded:      true,
                lastReset:      true,
                lastChampion:   true,
                lifetime:       true,
                session:        true,

                prism:          false, // TBD
            }),
        }
    }
}

class AccountFlags {
    constructor(data = {}) 
    {
        this.account = Flags.from(data.account, 
        {
            dirty:  false,
            active: false,
        });

        this.mercy = {};

        MercyUtil.forEachShard((shard, rarity) => 
        {
            this.mercy[shard] = {};
        })

        MercyUtil.forEachShard((shard, rarity) => 
        {
            this.mercy[shard][rarity] = Flags.from(data?.mercy?.[shard]?.[rarity],
            { 
                dirty: false
            })
        })
    }
}



class AccountMercy
{
    constructor(account, data = {}) 
    {
        this.flag = account.flag.mercy;

        MercyUtil.forEachShard((shard, rarity) => 
        {
            this[shard] ??= {};
            this[shard][rarity] = 
            {
                total: 0,
                session: null,
                lifetime: 0,
                lastAdded: 0,
                lastReset: null,
                lastChampion: null,
                ...(data[shard]?.[rarity] || {})
            };
        });
    }

    pull(shard, count)
    {
        if (shard === 'primal')
        {
            this[shard].mythical.total         += count;
            this[shard].mythical.lifetime      += count;
            this[shard].mythical.lastAdded     += count;
        
            this.flag[shard].mythical.dirty.set();
        }  
        
        this[shard].legendary.total            += count;
        this[shard].legendary.lifetime         += count;
        this[shard].legendary.lastAdded        += count;

        this.flag[shard].legendary.dirty.set();
    }

    reset(shard, rarity)
    {
        this[shard][rarity].total               = 0;
        this[shard][rarity].lastReset           = Timestamp.session();

        this.flag[shard][rarity].dirty.set();
    }

    lastChampion(shard, rarity, champion)
    {
        this[shard][rarity].lastChampion        = champion
    }


    refresh() 
    {
        MercyUtil.forEachShard((shard, rarity) => 
        {
            this[shard][rarity].lastAdded = 0;
        });

        log.trace('Refreshed mercy lastAdded session data');
    }
}



export { AccountManager, Account, AccountSettings, AccountData, AccountMercy }