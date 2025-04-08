import { Collection } from "discord.js";
import { log }                  from "../../../../utility/index.js";
import { ApplicationSystem }    from "./application.js";
import lodash                               from 'lodash';


class ClanManagement
{
    constructor(client, cluster, registry)
    {      
        this.registry       = registry;
        this.database       = cluster.clan;

        this.clan           = {};
        this.clans          = [];
        this.officersLounge = '1253926801600811069'
       
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
        
        this.clan[application.clan].member.count++;
        this.updateClan(this.clan[application.clan]);
        this.database.addMember(application)
    }

}




class Clan 
{
    constructor(data, applications) 
    {
        this.clan               = data.clan
        this.tier               = data.tier
        this.tag                = data.tag
        this.level              = data.level
        this.role               = data.role

        this.channel            = data.channel
        this.leadership         = data.leadership
        this.member             = data.member
        this.settings           = data.settings
        this.statistics         = data.statistics
        this.recruitment        = data.recruitment

        this.applications       = applications;
    }
};


export { ClanManagement }




// class Clan 
// {
//     constructor() 
//     {
//         this.clan               = 0
//         this.tier               = 0;
//         this.tag                = null;
//         this.level              = 0;
//         this.role               = null;

//         this.channel            =
//         {
//             home:               '',
//             announcements:      '',
//         }

//         this.leadership         =
//         {
//             leader:             '',
//             deputies:           [],
//             lieutenants:        [],
//         }

//         this.member             = 
//         {
//             count:              0,
//             list:               [],
//             active:             [],
//         };
        
//         this.settings           =
//         {
//             autoAccept:         false,
//             autoClear:          false,
//             transfers:          false,
//             alts:               false,
             
//         }

//         this.statistics         = 
//         {
//             clanboss:           { clearing: [] },
//             hydra:              { clearing: [] },
//             chimera:            { clearing: [] },
//             cvc:                { tier: 0, points: 0, average: 0 },
//             siege:              { tier: 0  }
//         };

//         this.recruitment        = 
//         {
//             clanTag:            false,
//             message:            '',
//             clanboss:           { custom: '', difficulty: null, keys: 0  },
//             hydra:              { custom: '', difficulty: null, keys: 0  },
//             chimera:            { custom: '', difficulty: null, keys: 0  },
//             cvc:                { custom: '', required: false, tier: 0, points: 0, average: 0 },
//             siege:              { custom: '', required: false }
//         };
//     }
// };