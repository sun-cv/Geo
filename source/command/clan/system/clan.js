import { log }                  from "../../../../utility/index.js";
import { ApplicationSystem }    from "./application.js";


class ClanCluster
{
    constructor(client, cluster, registry)
    {      
        this.registry       = registry;
        this.database       = cluster.clan;

        this.applications   = new ApplicationSystem(cluster, registry);

        this.clan = {};

        this.setClientContext(client);
    }


    async setClientContext(client)
    {
        this.initialize();
        client.clanCluster = this;
        log.admin(`Successfully initialized Clan Cluster`);
    }


    initialize()
    {
        const cluster = this.database.getClans();

        for (const clan of cluster) 
        {
            this.loadClan(clan)
        }
    }
    
    loadClan(clanName)
    {
        log.trace(`Loading ${clanName}'s clan data`)

        this.clan[clanName] = new Clan(this.database.loadClan(clanName));
    }


}




class Clan 
{
    constructor(data) 
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
    }
};


export { ClanCluster }




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
//             clanBoss:           { pushing: false, clearing: [], difficulty: null },
//             hydra:              { pushing: false, clearing: [], difficulty: null },
//             chimera:           { pushing: false, clearing: [], difficulty: null },
//             cvc:                { pushing: false, tier: 0, points: 0, average: 0 },
//             siege:              { pushing: false, tier: 0,  }
//         };

//         this.recruitment        = 
//         {
//             clanTag:            false,
//             clanBoss:           { custom: '', clearing: [], difficulty: null, keys: 0 },
//             hydra:              { custom: '', clearing: [], difficulty: null, keys: 0  },
//             chimera:           { custom: '', clearing: [], difficulty: null, keys: 0  },
//             cvc:                { custom: '', tier: 0, points: 0, average: 0 },
//             siege:              { custom: '', required: false }
//         };
//     }
// };