import { log } from '../../../../utility/index.js'


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

        const accounts = this.database.getAccounts(member);

        for (const account of accounts)
        {
            this.loadAccount(member, account.account);
        }
    }

    async loadAccount(member, accountName)
    {
        log.trace(`Loading account '${accountName}'`)

        const profile = this.database.loadAccountProfile(member, accountName);
        const data    = this.database.loadAccountData(member, accountName);
        
        const account = new Account(profile, data);

        member.account.set(account.account, account);
    }

    
    async createAccountProfile(member, accountName)
    {
        log.debug(`Creating new account profile '${accountName}'`)
        await this.database.createAccount(member, accountName);
    }


}


class Account 
{
    constructor(profile, data)
    {
        this.id         = profile.id;
        this.member     = profile.member;
        this.account    = profile.account;
        this.main       = !!profile.main;
        this.data       = JSON.parse(profile.data)      || {};
        this.settings   = JSON.parse(profile.settings)  || new AccountSettings();

        this.mercy      = data

        log.debug(`Instantiated ${this.member}'s account '${this.account}'`);
    }
}

class AccountSettings
{
    constructor()
    {

    }
}


export { AccountManager, Account, AccountSettings}