import { Collection } from "discord.js";
import { EmbedManager, log, Timestamp } from "../../../../utility/index.js";


class ApplicationSystem
{
    constructor(system)
    {
        this.registry       = system.registry;
        this.database       = system.database;

        this.channel        = 'clan-applications' 

        this.cache          = 
        {
            application:    new Collection(),
            transfer:       new Collection(),
            active:         new Collection(),
        }
        this.cacheApplications();
    }

    cacheApplications()
    {
        const applications = this.database.getApplications();

        if (applications)
        {
            for (const application of applications)
            {
                this.cache[application.request].set(application.id, application)
            }
            log.trace(`Successfully cached ${applications.length ? applications.length : '0'} applications`)
        }
    }

    resetCache()
    {
        this.cache.application  = new Collection();
        this.cache.transfer     = new Collection();

        this.cacheApplications();
    }
    
    getApplication(member)
    {
        if (this.cache.application.has(member.id))
        {
            return this.cache.application.get(member.id)
        }
        
        if (this.cache.transfer.has(member.id))
        {
            return this.cache.transfer.get(member.id)
        }
        
        return new Application()
    }

    createApplication(member, accountName)
    {
        log.trace(`Creating ${member.user.username}'s account application`)

        this.cache.application.set(member.id, new Application(this, {id: member.id, member: member.user.username, account: accountName, request: 'application'}));

        return this.cache.application.get(member.id)
    }

    hasApplicationRecord(member)
    {
        return this.database.hasApplicationRecord(member);
    }


    createTransfer(member)
    {
        if (!this.cache.application.has(member.id))
        {
            log.trace(`Created ${member.user.username}'s account transfer`)
            const data          = this.database.getApplicationRecord(member)
            const application   = new Application(this, data );
            application.request = 'transfer';
            application.status  = 'pending';
            this.cache.application.set(member.id, application);
        }
        log.trace(`Loaded ${member.user.username}'s account transfer`)

        return this.cache.application.get(member.id)
    }

    createTransferNoRecord(member, accountName)
    {
        log.trace(`Creating ${member.user.username}'s account transfer (no record)`)

        this.cache.transfer.set(member.id, new Application(this, {id: member.id, member: member.user.username, account: accountName, request: 'transfer'}));

        return this.cache.transfer.get(member.id)
    }

    getApplicationsByClan(clanName) 
    {
        return this.cache.application.filter(app => app.clan === clanName);
    }
    

    getTransfersByClan(clanName) 
    {
        return this.cache.transfer.filter(app => app.clan === clanName);
    }


    submitApplication(application)
    {
        this.database.submitApplication(application);
        this.resetCache();
    }

    updateApplication(application)
    {
        this.database.updateApplication(application);
    }

    async updateLanding(interaction)
    {
        const channel   = await this.registry.channels.get(this.channel)
        const messages  = await channel.messages.fetch()
        const message   = messages.first()

        message.edit(EmbedManager.set(interaction).load('embed-clan-application-landing').create())
    }
    
}


const flag = { ignore: true };

export { ApplicationSystem, flag };






class Application 
{
    constructor(system, data = {}) 
    {
        this.system     =   system;
        this.application=   data.application            || '';

        this.id         =   data.id                     || '';
        this.member     =   data.member                 || '';
        this.account    =   data.account                || '';
        this.request    =   data.request                || '';
        this.clan       =   data.clan                   || '';
        this.status     =   data.status                 || 'pending';

        this.selection       = 
        {
            preferred:      data.selection?.preferred   || '',
            alternate:      data.selection?.alternate   || '',
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
            active: data.siege?.active != null ?      !!data.siege.active : '',
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
            admin:          data.admin?.admin           || '',
            transfer:
            {
                from:       data.admin?.transfer.from   || '',
                to:         data.admin?.transfer.to     || '',
            }
        };  

        this.meta       =   
        {   
            location:       0,
            autoAccept:     data.meta?.autoAccept       || null,
            submitted:      false,
            accepted:       false,
        };  

        this.timestamp  =   data.timestamp              || Timestamp.iso();
    }

    valid() {
        const fields = [
            { key: 'selection.preferred',   value: this.selection.preferred },
            { key: 'siege.active',          value: this.siege.active },
            { key: 'cvc.points',            value: this.cvc.points },
            { key: 'clanboss.difficulty',   value: this.clanboss.difficulty },
            { key: 'clanboss.keys',         value: this.clanboss.keys },
            { key: 'hydra.difficulty',      value: this.hydra.difficulty },
            { key: 'hydra.damage',          value: this.hydra.damage },
            { key: 'chimera.difficulty',    value: this.chimera.difficulty },
            { key: 'chimera.damage',        value: this.chimera.damage },
        ];

        const missingField = fields.find(({ value }) => value == '');

        if (missingField) 
        {
            this.meta.location = fields.indexOf(missingField);
            return false;
        }
        return true;
    }

    submit()
    {
        this.meta.submitted = true;
        this.system.submitApplication(this);
    }

}


