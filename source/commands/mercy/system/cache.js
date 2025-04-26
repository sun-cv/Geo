import { Collection }   from 'discord.js';
import { log }          from '#utils'


class MemberCache extends Collection
{
    constructor(registry)
    {
        super();
        
        if (!registry) 
        {
            registry = this;
        }
    }

    set(member)
    {
        log.trace(`Caching ${member.username}'s member profile`);
        super.set(member.id, member);
    }
    
    get(iMember)
    {
        log.trace(`Retrieving cache for ${iMember.user.username}`);
        return super.get(iMember.id);
    }
    
    has(iMember)
    {
        const exists = super.has(iMember.id);
        log.trace(`Cache ${exists ? 'found' : 'not found'} for ${iMember.user.username}`);
        return exists;
    }
}



class AccountCache extends Collection 
{
    constructor(registry, member) 
    {
        super();

        if (!registry.has(member.id)) 
        {
            registry.set(member.id, this);
        }
    }

    set(account)
    {
        log.trace(`Caching account profile '${account.name}'`);
        super.set(account.name, account);
    }
    
    get(accountName)
    {
        log.trace(`Retrieving cache for account '${accountName}'`);

        return super.get(accountName);
    }
   
    has(accountName)
    {
        const exists = super.has(accountName);
        log.trace(`Cache ${exists ? 'found' : 'not found'} for account '${accountName}'`);
        return exists;
    }

    delete(accountName)
    {
        log.trace(`Deleting account cache '${accountName}'`);
        super.delete(accountName);
    }
}







export { MemberCache, AccountCache }