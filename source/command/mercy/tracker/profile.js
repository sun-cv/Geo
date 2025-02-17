import { Collection }       from 'discord.js';
import { log, Text }        from '../../../../utility/index.js'
import { MemberManager }    from './member.js';
import { AccountManager }   from './account.js';


class ProfileManager
{
    constructor(mercy)
    {
        this.mercy          = mercy

        this.memberManager  = new MemberManager(mercy)
        this.accountManager = new AccountManager(mercy);
    }

    findMemberProfile(iMember)
    {
        const exists = 
        {
            cache: this.memberManager.searchCache(iMember)
        };
    
        if (!exists.cache)
        {
            exists.database = this.memberManager.searchDatabase(iMember);
        }
    
        return exists;
    }
    

        
    get(iMember)
    {
        const exists = this.findMemberProfile(iMember);

        if (exists.cache)
        {
            return this.memberManager.getCache(iMember);
        }

        if (exists.database)
        {
            return this.loadMemberProfile(iMember);
        }
        
        return this.createMemberProfile(iMember);
    }


    loadMemberProfile(iMember)
    {
        const member   = this.memberManager.loadMember(iMember)
        const accounts = this.accountManager.loadAccounts(member);

        return member;
    }

    createMemberProfile(iMember)
    {
        this.memberManager.createMemberProfile(iMember);
        this.accountManager.createAccountProfile(this.memberManager.loadMember(iMember), "main");

        log.admin(`Successfully created member profile for ${iMember.user.username}`)

        return Object.assign(this.loadMemberProfile(iMember), { new: true });
    }

    update(member)
    {
        this.memberManager.updateMember(member);

        member.account.filter((account) => account.flag.dirty.account).forEach((account) => 
        {
            this.accountManager.updateAccount(account);
        })
    }
}



export { ProfileManager }