import { Collection }       from 'discord.js';
import { log, Text }        from '../../../../utility/index.js'
import { MemberManager }    from './member.js';
import { AccountManager }   from './account.js';


class ProfileManager
{
    constructor(mercy)
    {
        this.mercy          = mercy

        this.member         = new MemberManager(mercy)
        this.account        = new AccountManager(mercy);
    }

        
    get(iMember)
    {
        const exists = this.findMemberProfile(iMember);

        if (exists.cache)
        {
            return this.member.getCache(iMember);
        }

        if (exists.database)
        {
            return this.loadMemberProfile(iMember);
        }
        
        return this.createMemberProfile(iMember);
    }

    findMemberProfile(iMember)
    {
        const exists = {};

        exists.cache = this.member.searchCache(iMember);

        if (!exists.cache)
        {
            exists.database = this.member.searchDatabase(iMember);
        }
        return exists;
    }

    
    loadMemberProfile(iMember)
    {
        const member   = this.member.loadMember(iMember)
        const accounts = this.account.loadAccounts(member);

        return member;
    }

    createMemberProfile(iMember)
    {
        this.member.createMemberProfile(iMember);
        this.account.createAccountProfile(this.member.loadMember(iMember), "main");

        log.admin(`Successfully created member profile for ${iMember.user.username}`)

        return Object.assign(this.loadMemberProfile(iMember), {new: true});
    }
}



export { ProfileManager }