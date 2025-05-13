import lodash                   from 'lodash';
import { Collection }           from 'discord.js';
import { log }                  from '#utils';
import { ApplicationSystem }    from './application.js';


class ClanManagement
{
    constructor(client, registry, cluster)
    {      
        this.registry       = registry;
        this.database       = cluster.clan;

        this.clan           = {};
        this.clans          = [];
        this.officersTable  = "officers-table"
       
        this.applications   = new ApplicationSystem(this);

        this.cache          =
        {
            active:         new Collection(),
            clones:         new Collection(),
            selection:      new Collection(),
        } 

        this.setClientContext(client);
    }


    async setClientContext(client)
    {
        this.initialize();
        client.clanManagement = this;
        log.admin(`Successfully initialized Clan Cluster`);
    }


    initialize()
    {
        const cluster = this.database.getClans();

        for (const clan of cluster) 
        {
            this.loadClan(clan)
            this.clans.push(clan)
        }
    }
    
    loadClan(clanName)
    {
        log.debug(`Loading ${clanName}'s clan data`)

        this.clan[clanName] = new Clan(this.database.loadClan(clanName), this.applications);
    }

    cloneClan(clanName)
    {
        return lodash.cloneDeepWith(this.clan[clanName], (val, key) => { if (key === 'applications') return val });
    }

    updateClan(data)
    {
        log.debug(`Updating ${data.clan}'s clan data`)

        this.database.updateClan(data);
    }

    resetCache(clan)
    {
        this.loadClan(clan)
    }

    addMember(application)
    {
        log.debug(`Adding member ${application.account} to clan: ${application.clan}`)
        
        if (!this.database.hasMember(application))
        {
            this.clan[application.clan].member.count++;
            this.updateClan(this.clan[application.clan]);
            this.database.addMember(application);
            return;
        }
        this.database.updateMember(application)
    }

}



class Clan 
{
    constructor(data = {}, applications = []) 
    {
        this.clan       = data.clan                         ?? 0;
        this.tier       = data.tier                         ?? 0;
        this.tag        = data.tag                          ?? null;
        this.level      = data.level                        ?? 0;
        this.role       = data.role                         ?? null;

        this.channel    = 
        {
            home:           data.channel?.home              ?? '',
            announcements:  data.channel?.announcements     ?? '',
        };

        this.leadership = 
        {
            leader:         data.leadership?.leader         ?? '',
            deputies:       data.leadership?.deputies       ?? [],
            lieutenants:    data.leadership?.lieutenants    ?? [],
        };

        this.member     = 
        {
            count:          data.member?.count              ?? 0,
            list:           data.member?.list               ?? [],
            active:         data.member?.active             ?? [],
        };

        this.settings   = 
        {
            autoAccept:     data.settings?.autoAccept       ?? false,
            autoClear:      data.settings?.autoClear        ?? false,
            transfers:      data.settings?.transfers        ?? false,
            alts:           data.settings?.alts             ?? false,
        };      

        this.statistics = 
        {     
            clanboss:       data.statistics?.clanboss       ?? { clearing: [] },
            hydra:          data.statistics?.hydra          ?? { clearing: [] },
            chimera:        data.statistics?.chimera        ?? { clearing: [] },
            cvc:            data.statistics?.cvc            ?? { tier: 0, points: 0, average: 0 },
            siege:          data.statistics?.siege          ?? { tier: 0 },
        };

        this.recruitment = 
        {
            clanTag:        data.recruitment?.clanTag       ?? false,
            message:        data.recruitment?.message       ?? '',
            clanboss:       data.recruitment?.clanboss      ?? { custom: '', difficulty: null, keys: 0 },
            hydra:          data.recruitment?.hydra         ?? { custom: '', difficulty: null, keys: 0 },
            chimera:        data.recruitment?.chimera       ?? { custom: '', difficulty: null, keys: 0 },
            cvc:            data.recruitment?.cvc           ?? { custom: '', required: false, tier: 0, points: 0, average: 0 },
            siege:          data.recruitment?.siege         ?? { custom: '', required: false },
        };

        this.applications = applications;
    }
}

export { ClanManagement } 