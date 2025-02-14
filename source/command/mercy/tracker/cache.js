import { log } from '../../../../utility/index.js'


class MemberCache
{
    constructor(registry)
    {
        this.registry = registry.member; 
    }

    set(member)
    {
        log.trace(`Caching ${member.member}'s member profile`);
        this.registry.set(member.id, member);
    }
    
    get(iMember)
    {
        log.trace(`Retrieving cache for ${iMember.user.username}`);
        return this.registry.get(iMember.id);
    }
    
    has(iMember)
    {
        const exists = this.registry.has(iMember.id);
        log.trace(`Cache ${exists ? 'found' : 'not found'} for ${iMember.user.username}`);
        return exists;
    }

}

export { MemberCache }