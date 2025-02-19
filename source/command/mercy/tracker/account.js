import Shards               from '../../../../source/data/mercy/shards.json' with { type: 'json' };
import { log, Timestamp }   from '../../../../utility/index.js'
import { Session }          from './session.js';


class AccountManager
{
    constructor(mercy)
    {
        this.mercy          = mercy

        this.registry       = mercy.registry;
        this.database       = mercy.database

    }


    loadAccounts(member)
    {
        log.debug(`Loading ${member.member}'s accounts`)

        this.database.getAccounts(member).forEach((account) => 
        {
            this.loadAccount(member, account.account);
        })
        
    }

    loadAccount(member, accountName)
    {
        log.trace(`Loading account '${accountName}'`)

        const account = new Account(
            this.database.loadAccountProfile(member, accountName),
            this.database.loadAccountData   (member, accountName),
            this.database.loadAccountSession(member, accountName)
        );

        member.accounts.push(account.account);
        member.account .set (account.account, account);
    }

    
    async createAccountProfile(member, accountName)
    {
        log.debug(`Creating new account profile '${accountName}'`)

        await this.database.createAccount(member, accountName);
    }

    async updateAccount(account)
    {
        log.trace(`Updating ${account.member}'s account ${account.account}`);

        await Promise.all([
            this.database.updateAccount(account),
            this.database.updateAccountMercy(account),
            this.database.updateAccountSession(account),
            this.database.updateAccountLogs(account)
        ]);

        account.clean();
    }


}


class Account 
{
    constructor(profile, mercy, session)
    {
        this.id         = profile.id;
        this.member     = profile.member;
        this.account    = profile.account;
        this.main       = !!profile.main;
        this.data       = new AccountData(JSON.parse(profile.data));
        this.settings   = new AccountSettings(JSON.parse(profile.settings));

        this.mercy      = new AccountMercy(mercy);
        this.session    = new Session(this, session);
        
        this.flag       = new AccountFlags();
        
        this.lastActive = Timestamp.iso();
        this.registered = profile.registered;

        log.debug(`Instantiated ${this.member}'s account '${this.account}'`);
    }

    dirty()
    {
        this.flag.dirty.account = true;
        log.trace(`${this.account} flagged dirty`)
    }

    clean()
    {
        this.flag.dirty.account = false;
        log.trace(`${this.account} marked clean`)
    }

    pull(shard, count)
    {
        this.validateSession();

        this.session.logPull(shard, count);
        this.mercy.pull(shard, count, this.flag);

        this.dirty();
    }

    reset(shard, rarity, champion)
    {
        this.validateSession();

        const total = this.mercy[shard][rarity].total;

        this.session.logReset(shard, rarity, total);
        this.session.logChampion(shard, rarity, total, champion);
        
        this.mercy.reset(shard, rarity, this.flag);
        this.mercy.lastChampion(shard, rarity, champion);

        this.dirty();
    }

    validateSession()
    {
        if (!this.session.session == Timestamp.session())
        {
            log.debug(`Invalid session: ${this.session.session}. Refreshing session`)
            this.session.refresh();
            this.mercy.refresh();
        }
    }
}



    // classes for account configuration and reference
class AccountData
{

}



class AccountSettings
{
    constructor()
    {

    }
}

class AccountFlags
{
    constructor()
    {
        this.dirty = 
        {
            account: false,
            ancient: { legendary: false },
            void:    { legendary: false },
            primal:  { legendary: false, mythical: false },
            sacred:  { legendary: false },
            prism:   { legendary: false }
        }
    }
}


class AccountMercy
{
    constructor(data = {},)
    {
        for (const [shard, rarities ] of Object.entries(Shards.mercy))
        {
            this[shard] = {};

            for (const rarity in rarities)
            {

                this[shard][rarity] = 
                {
                    total: 0,
                    session: 0,
                    lifetime: 0,
                    lastAdded: null,
                    lastReset: null,
                    lastChampion: null
                };


                if (data[shard] && data[shard][rarity])
                {
                    this[shard][rarity] = 
                    {
                        ...this[shard][rarity], 
                        ...data[shard][rarity]
                    };
                }
            }
        }
    }

    pull(shard, count, flag)
    {
        if (shard === 'primal')
        {
            this[shard].mythical.total         += count;
            this[shard].mythical.lifetime      += count;
            this[shard].mythical.lastAdded     += count;
        
            flag.dirty[shard].mythical         = true;
        }  
        
        this[shard].legendary.total            += count;
        this[shard].legendary.lifetime         += count;
        this[shard].legendary.lastAdded        += count;

        flag.dirty[shard].legendary             = true;
    }

    reset(shard, rarity, flag)
    {
        this[shard][rarity].total               = 0;
        this[shard][rarity].lastReset           = Timestamp.session();
        flag.dirty[shard][rarity]               = true;
    }

    lastChampion(shard, rarity, champion)
    {
        this[shard][rarity].lastChampion        = champion
    }


    refresh()
    {
        for (const [shard, rarities ] of Object.entries(Shards.mercy))
        {
            for (const rarity in rarities)
            {
                this[shard][rarity].lastAdded = 0;
            }
        }
        log.trace('Refreshed mercy lastAdded session data')
    }
    

}



export { AccountManager, Account, AccountSettings}