import { Collection } from "discord.js";
import { log, Timestamp } from "../../../../utility/index.js";


class ApplicationSystem
{
    constructor(cluster, registry)
    {
        this.registry       = registry;
        this.database       = cluster.clan;

        this.cache          = 
        {
            application:    new Collection(),
            transfer:       new Collection()
        }
    }

    getApplication(member, accountName)
    {
        if (!this.cache.application.has(member.id))
        {
            log.trace(`Created ${member.user.username}'s account application`)

            this.cache.application.set(member.id, new Application({id: member.id, member: member.user.username, account: accountName, request: 'application'}));
        }
        log.trace(`Loaded ${member.user.username}'s account application`)

        return this.cache.application.get(member.id)
    }

    getTransfer(member)
    {
        if (!this.cache.transfer.has(member.id))
        {
            log.trace(`Created ${member.user.username}'s account transfer`)
            
            this.cache.transfer.set(member.id, new Application({id: member.id, member: member.user.username, account: accountName, request: 'transfer'}));
        }
        log.trace(`Loaded ${member.user.username}'s account transfer`)

        return this.cache.transfer.get(member.id)
    }




}


const flag = { ignore: true };

export { ApplicationSystem, flag };






class Application 
{
    constructor(data = {}) 
    {
        this.application=   data.application            || '';

        this.id         =   data.id                     || '';
        this.member     =   data.member                 || '';
        this.account    =   data.account                || '';
        this.request    =   data.request                || '';
        this.selection  =   data.selection              || '';
        this.status     =   data.status                 || 'pending';

        this.clan       = 
        {
            selection:      data.clan?.selection        || '',
            alternate:      data.clan?.alternate        || '',
        };

        this.clanboss   = 
        {
            difficulty:     data.clanboss?.difficulty   || '',
            keys:           data.clanboss?.keys         || '',
            get complete() {
                return !!(this.difficulty && this.keys);
            }        
        };

        this.hydra      = 
        {
            difficulty:     data.hydra?.difficulty      || '',
            damage:         data.hydra?.damage          || '',
            get complete() {
                return !!(this.difficulty && this.damage);
            }       
        };

        this.chimera    = 
        {
            difficulty:     data.chimera?.difficulty    || '',
            damage:         data.chimera?.damage        || '',
            get complete() {
                return !!(this.difficulty && this.damage);
            }       
        };

        this.siege      = 
        {
            active: data.siege?.active != null ?        !!data.siege.active : null,
        };  

        this.cvc        =   
        {   
            points:         data.cvc?.points            || '',
        };  

        this.data       =   
        {   
            response:       data.data?.response         || '',
        };  

        this.setting    =   
        {   
            waitlist:       data.setting?.waitlist      ?? false,
        };  

        this.admin      =   
        {   
            transfer:       data.admin?.transfer        || '',
        };  

        this.meta       =   
        {   
            location:       0,
            autoAccept:     data.meta?.autoAccept       || null,
        };  

        this.timestamp  =   data.timestamp              || Timestamp.iso();
    }
}


