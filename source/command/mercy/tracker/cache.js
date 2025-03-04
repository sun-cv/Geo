import { Collection } from 'discord.js';
import { log } from '../../../../utility/index.js'


class MemberCache extends Collection
{
    constructor(mercy)
    {
        super();
        
        if (!mercy.registry.member) 
        {
            mercy.registry.member = this;
        }
    }

    set(member)
    {
        log.trace(`Caching ${member.member}'s member profile`);
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


        if (!registry.account.has(member.id)) 
        {
            registry.account.set(member.id, this);
        }
    }

    set(account)
    {
        log.trace(`Caching account profile '${account.account}'`);
        super.set(account.account, account);
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
        log.trace(`Deleting account profile '${accountName}'`);
        super.delete(accountName);
    }
}







export { MemberCache, AccountCache }