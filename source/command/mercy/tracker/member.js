import { log, Timestamp }           from '../../../../utility/index.js';
import { AccountManager } from './account.js';
import { MemberCache }              from './cache.js';

class MemberManager
{
    constructor(mercy)
    {
        this.mercy      = mercy;
        this.database   = mercy.database;

        this.cache      = new MemberCache(mercy);
        
    }

    findMember(iMember)
    {
        const exists = { cache: this.cache.has(iMember) };
    
        if (!exists.cache)
        {
            exists.database = this.database.has('member', 'id', iMember.id);
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
        const member  = new Member(this.mercy, profile);

        this.cache.set(member);

        return member;
    }

    createMember(iMember)
    {
        log.debug(`Creating new member profile for ${iMember.user.username}`);

        this.database.createMember(iMember);

        const member = this.loadMember(iMember);
              member.account.create('Main', true)

        return Object.assign(member, { new: true });
    }

    update(member)
    {
        log.trace(`Updating member ${member.member}`);

        this.database.updateMember(member);
        member.account.updateAccounts();

    }
    
}



class Member
{
    constructor(mercy, profile)
    {
        this.mercy      = mercy

        this.id         = profile.id;
        this.member     = profile.member;
        this.accounts   = JSON.parse(profile.accounts)   || [];
        this.data       = JSON.parse(profile.data)       || {};
        this.settings   = JSON.parse(profile.settings)   || new MemberSettings();
        
        this.account    = new AccountManager(this);

        this.lastActive = Timestamp.iso();
        this.registered = profile.registered;

        log.debug(`Instantiated ${this.member}'s member profile`);
    }

    update()
    {
        this.mercy.memberManager.update(this);
    }  

}


class MemberSettings
{
    constructor()
    {

    }
}


export { MemberManager, Member, MemberSettings };