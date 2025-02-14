import { Collection }   from 'discord.js'
import { log }          from '../../../../utility/index.js';
import { MemberCache }  from './cache.js';

class MemberManager
{
    constructor(mercy)
    {
        this.cache      = new MemberCache(mercy.registry);
        this.database   = mercy.database;
    }

    searchCache(iMember)
    {
        return this.cache.has(iMember);
    }

    searchDatabase(iMember)
    {

        return this.database.has('member', 'id', iMember.id);
    }

    getCache(iMember)
    {
        return this.cache.get(iMember);
    }

    loadMember(iMember)
    {
        log.trace(`Loading ${iMember.user.username}'s member profile`);

        if (this.searchCache(iMember))
        {
            return this.getCache(iMember);
        }

        const profile = this.database.loadMember(iMember);
        const member  = new Member(profile);

        this.cache.set(member);

        return member;
    }

    createMemberProfile(iMember)
    {
        log.debug(`Creating new member profile for ${iMember.user.username}`);
        this.database.createMember(iMember);
    }
}



class Member
{
    constructor(profile)
    {
        this.id         = profile.id;
        this.member     = profile.member;
        this.data       = JSON.parse(profile.data)       || {};
        this.settings   = JSON.parse(profile.settings)   || new MemberSettings();
        
        this.account    = new Collection();
        
        this.lastActive = profile.lastActive;
        this.registered = profile.registered;

        log.debug(`Instantiated ${this.member}'s member profile`);
    }        
}


class MemberSettings
{
    constructor()
    {

    }
}


export { MemberManager, Member, MemberSettings };