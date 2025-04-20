import { log, Timestamp }           from '../../../../utility/index.js';
import { AccountManager }           from './account.js';
import { MemberCache }              from './cache.js';

class MemberManager
{
    constructor(tracker)
    {
        this.registry   = 
        {
            member:     tracker.registry.member,
            account:    tracker.registry.account,
        }

        this.database   = tracker.database;
        
        this.cache      = new MemberCache(this.registry.member);
    }

    findMember(iMember)
    {
        const exists = { cache: this.cache.has(iMember) };
    
        if (!exists.cache)
        {
            exists.database = this.database.has('member', 'member_id', iMember.id);
        }
    
        return exists;
    }


    get(iMember)
    {
        const exists = this.findMember(iMember);

        if (exists.cache)
        {
            return this.cache.get(iMember);
        }

        if (exists.database)
        {
            return this.loadMember(iMember);
        }
        
        return this.createMember(iMember);
    }


    loadMember(iMember)
    {
        log.trace(`Loading ${iMember.user.username}'s member profile`);

        const profile = this.database.loadMember(iMember);
        const member  = new Member(this, profile);

        this.cache.set(member);

        return member;
    }

    createMember(iMember)
    {
        log.debug(`Creating new member profile for ${iMember.user.username}`);

        this.database.createMember(iMember);

        const member = this.loadMember(iMember);
              member.account.create('main', true)

        member.update();

        return Object.assign(member, { new: true });
    }

    update(member)
    {
        log.debug(`Updating member ${member.username}`);
        this.database.updateMember(member);
    }
        
}



class Member
{
    constructor(manager, profile)
    {
        
        this.manager    = manager
        
        this.id         = profile.member_id;
        this.username   = profile.username;
        this.accounts   = [];
        this.data       = new MemberData    (profile.data);
        this.settings   = new MemberSettings(profile.settings);
        this.records    = new MemberRecords (profile.records);

        this.lastActive = Timestamp.iso();
        this.registered = profile.registered;
        
        log.debug(`Instantiated ${this.username}'s member profile`);

        this.account    = new AccountManager(this);
    }

    update()
    {
        this.manager.update(this);
    }

    updateAccounts()
    {
        log.trace(`Updating ${this.username}'s accounts`);
        this.account.updateAccounts()
    }

    updateAccountsCache(account)
    {
        log.trace(`Updating ${this.username}'s accounts cache`);
        this.accounts = this.accounts.filter((accounts) => accounts.id != account.id);
        this.accounts.push({ id: account.id, name: account.name });
        this.manager.update(this);
    }

}


class MemberData
{
    constructor()
    {

    }
}

class MemberSettings
{
    constructor()
    {

    }
}

class MemberRecords
{
    constructor(data)
    {

    }
}

export { MemberManager, Member, MemberSettings };