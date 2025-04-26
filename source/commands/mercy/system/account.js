import { log, Timestamp, Flags, MercyUtil, Snowflake}   from '#utils'
import { Session }                                      from './session.js';
import { AccountCache }                                 from './cache.js';


class AccountManager
{
    constructor(member)
    {
        this.registry   = 
        {
            account:      member.manager.registry.account,
        }        
        this.database   = member.manager.database;

        this.cache      = new AccountCache(this.registry.account, member);

        this.member     = member;

        this.loadAccounts();
    }

    // Standard

    create(accountName, main)
    {
        log.debug(`Creating new account '${accountName}'`);

        const account_id = this.database.createAccount(this.member, accountName, main)

        this.loadAccount(account_id);

        this.member.updateAccountsCache({ id: account_id, name: accountName});
    }

    delete(accountName)
    {
        log.debug(`Deleting account '${accountName}'`);

        const account = this.cache.get(accountName)

        this.database.deleteAccount(this.member, account.id);
        this.cache.delete(accountName);
        this.member.accounts = this.member.accounts.filter((accounts) => accounts.id != account.id);
    }

    get(accountName)
    {
        const account = accountName ? this.cache.get(accountName) : this.cache.find(account => account.main);
        
        account.flag.account.active.set();
    
        for (const [name, cache] of this.cache)
        {
            if (cache !== account)
            {
                cache.flag.account.active.clear();
            }
        }
        return account;
    }

    getActive()
    {
        for (const [name, account] of this.cache)
        {
            if (account.flag.account.active.get())
            {
                return account
            }
        }
    }
    
    // Load Account

    loadAccounts()
    {
        log.debug(`Loading ${this.member.username}'s accounts`)

        this.database.getAccounts(this.member).forEach((data) => 
        {
            this.loadAccount(data.account_id);
        })
    }

    loadAccount(account_id)
    {
       
        const account = new Account(
            this,
            this.database.loadAccountProfile(this.member, account_id),
            this.database.loadAccountData   (this.member, account_id),
            this.database.loadAccountSession(this.member, account_id)
        );
        
        if (!this.member.accounts.includes({ id: account.id, name: account.name })) 
        {
            this.member.accounts.push({ id: account.id, name: account.name });
        }        
            
        this.cache.set(account);
        log.trace(`Loaded account '${account.name}'`)
    }

    // Update Account

    async updateAccounts()
    {
        log.debug(`Updating ${this.member.username}'s accounts`);

        for (const account of this.cache.values()) 
        {
            await this.updateAccount(account);
        }
    }

    async updateAccount(account)
    {
        log.trace(`Updating account '${account.name}'`);

        await this.database.updateAccount(account),

        await Promise.all([
            this.database.updateAccountMercy(account),
            this.database.updateAccountSession(account),
            this.database.updateAccountLogs(account)
        ]);

        log.debug(`Successfully updated ${account.name}`);

        account.flag.account.dirty.clear()
    }

    // Feed

    allAccountsFeed()
    {
        const feed = []

        log.debug(`Generating all account feeds`)

        for (const [key, account] of this.cache)
        {
            feed.push(...this.accountFeed(account));
        }

        feed.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        return feed
    }

    accountFeed(account)
    {
        log.trace(`Generating account feed for ${account.name}`)

        const data = this.database.getAccountLogs(account);
        const feed = []

        feed.push({log: `${Timestamp.session(account.registered)}: ${account.member.username} created account ${account.name}`, timestamp: account.registered})

        for (const [type, array] of Object.entries(data))
        {
            for (const entry of array)
            {
                feed.push(format[type](entry, account));
            }
        }
        feed.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        return feed;
    }


}

const format =
{
    pull:       (entry, account) => { return {log: `${entry.session}: ${account.name} pulled ${entry.count} ${entry.source} ${entry.count == 1 ? 'shard' : 'shards'}`,  timestamp: entry.timestamp }},
    reset:      (entry, account) => { return {log: `${entry.session}: ${account.name} reset ${entry.source} shards on shard ${entry.total}`,                            timestamp: entry.timestamp }},
    champion:   (entry, account) => { return {log: `${entry.session}: ${account.name} pulled ${entry.rarity} champion ${entry.champion} from ${entry.source}`,                               timestamp: entry.timestamp }}
}



class Account 
{
    constructor(manager, profile, mercy, session)
    {
        this.manager    = manager;

        this.id         = profile.id;
        this.member     = profile.member; // username, id
        this.name       = profile.name;
        this.main       = !!profile.main;

        this.data       = new AccountData       (profile.data);
        this.settings   = new AccountSettings   (profile.settings);
        this.records    = new AccountRecords    (profile.records);
        this.flag       = new AccountFlags      (profile.flags);
        this.mercy      = new AccountMercy      (this, mercy);
        this.session    = new Session           (this, session);

        this.lastActive = Timestamp.iso();
        this.registered = profile.registered;

        log.debug(`Instantiated ${this.member.username}'s account '${this.name}'`);
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
        this.mercy.lastChampion(shard, rarity, champion)

        this.flag.account.dirty.set();
    }

    log(source, rarity, champion, count)
    {
        this.validateSession();

        if (MercyUtil.isShard(source))
        {
            this.mercy.lastChampion(source, rarity, champion)
        }

        this.session.logChampion(source, rarity, champion, count)

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

    update()
    {
        this.manager.updateAccount(this);
    }

    feed()
    {
        return this.manager.accountFeed(this);
    }

    alias(accountName)
    {
        this.records.alias.push({name: this.name, timestamp: Timestamp.iso()})
        this.manager.cache.delete(this.name);
        this.name = accountName;
        this.mercy.forceUpdate();
        this.manager.cache.set(this);
        this.update();
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
                static:         ['tatsu'],
                rotate:         ['tatsu', 'zinogre', 'tuhanarak'],
                custom:         ['tatsu', 'zinogre', 'tuhanarak', 'skytouched-shaman','conscript'],
            },
        }
        this.historical = data?.account ||
        {
            name: [],
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
                static:         false,
                rotate:         true,
                random:         false,
                custom:         false,
                text:           false,
            }, { exclusive: true}),

            display: Flags.from(data?.template?.display,
            {
                total:          true,
                mercy:          true,
                lastAdded:      true,
                lastReset:      true,
                lastChampion:   true,
                lifetime:       true,
                session:        true,

                prism:          true, // TBD
            }),
        }
    }
}

class AccountRecords
{
    constructor(data)
    {
        this.alias  = data?.alias   || [];

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
        }, { prism: true })

        MercyUtil.forEachShard((shard, rarity) => 
        {
            this.mercy[shard][rarity] = Flags.from(data?.mercy?.[shard]?.[rarity],
            { 
                dirty: false
            })
        }, { prism: true})
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
        
            const total = data[shard]?.[rarity]?.total || 0;
        
            const entry = {
                total,
                mercy: null,
                session: 0,
                lifetime: 0,
                lastAdded: 0,
                lastReset: null,
                lastChampion: null,
                ...(data[shard]?.[rarity] || {})
            };
        
            Object.defineProperty(entry, 'mercy', {
                get: () => MercyUtil.calculateMercy(shard, rarity, entry.total),
                enumerable: true
            });
        
            this[shard][rarity] = entry;
        }, { prism: true });

    }

    pull(shard, count)
    {
        if (shard === 'primal')
        {
            this[shard].mythical.total         += count;
            this[shard].mythical.lifetime      += count;
            this[shard].mythical.lastAdded     += count;
            this[shard].mythical.session        = Timestamp.session()
            
            this.flag[shard].mythical.dirty.set();
        }  
        
        this[shard].legendary.total            += count;
        this[shard].legendary.lifetime         += count;
        this[shard].legendary.lastAdded        += count;
        this[shard].legendary.session           = Timestamp.session()

        this.flag[shard].legendary.dirty.set();

    }

    reset(shard, rarity)
    {
        this[shard][rarity].total               = 0;
        this[shard][rarity].lastReset           = Timestamp.session();
        this[shard][rarity].session             = Timestamp.session()

        this.flag[shard][rarity].dirty.set();
    }

    lastChampion(shard, rarity, champion)
    {
        this[shard][rarity].lastChampion        = champion

        this.flag[shard][rarity].dirty.set();
    }

    refresh() 
    {
        MercyUtil.forEachShard((shard, rarity) => 
        {
            this[shard][rarity].lastAdded = 0;
            
            this.flag[shard][rarity].dirty.set();
        });

        log.trace('Refreshed mercy lastAdded session data');
    }

    forceUpdate()
    {
        MercyUtil.forEachShard((shard, rarity) => 
            {                
                this.flag[shard][rarity].dirty.set();
            });
        log.trace('Flagged mercy session data');
    }
}



export { AccountManager, Account, AccountSettings, AccountData, AccountMercy }