import { Client, GatewayIntentBits} from 'discord.js';
import config                       from '#env/secret/credentials.json' with { type: 'json' };
import { log }                      from '#utils'
import { Registry }                 from '#registry/registry.js'
import { Dispatcher }               from '#events/dispatcher.js'
import { Interaction }              from '#events/interaction/interaction.js'
import { Message }                  from '#events/message/message.js'
import { TaskManager }              from '#tasks/taskManager.js'
import { MercyTracker }             from '#commands/mercy/system/mercy.js'
import { Cluster }                  from '#databases/models/cluster.js'
import { ClanManagement }           from '#commands/clan/system/clan.js'
import { Promocode }                from '#commands/promocode/system/promocode.js';

log.admin('Initiating startup sequence');

class Bot
{
    constructor()
    {
        this.client     = new Client(
        {
            intents: 
            [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent,
            ],
        });

        this.cluster        = new Cluster();

        this.registry       = new Registry          (this.client);
        this.dispatcher     = new Dispatcher        (this.client);
        this.interaction    = new Interaction       (this.client, this.registry);
        this.message        = new Message           (this.client, this.registry)
        this.scheduler      = new TaskManager       (this.client, this.registry, this.cluster);

        this.mercyTracker   = new MercyTracker      (this.client, this.registry, this.cluster);
        this.clanManagement = new ClanManagement    (this.client, this.registry, this.cluster);
        this.promocode      = new Promocode         (this.client, this.registry)
    }
    

    async initialize()
    {
        await this.dispatcher.setContext(this);
        await this.dispatcher.registerEvents();
        await this.dispatcher.registerClient(this.interaction.create);
        await this.dispatcher.registerClient(this.message.create);

        await this.registry.registerModules();
        await this.registry.deployCommands();

        await this.scheduler.registerTasks();

        this.login();
    }

    
    async login()
    {
        await this.client.login(config.token);

        await this.registry.registerGuild();
        await this.promocode.registerChannel();
        
        this.engage()
    }
    
    async engage()
    {
        log.admin("All systems online. Engage!")
    }
    
    shutdown()
    {
        log.admin('Powering down..')
    }


}


export { Bot }

