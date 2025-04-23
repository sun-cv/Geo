import config                       from '../env/secret/credentials.json' with { type: 'json' };
import { Client, GatewayIntentBits} from 'discord.js';
import { log }                      from '../utility/index.js'
import { Registry }                 from '../source/registry/registry.js'
import { Dispatcher }               from '../source/event/dispatcher.js'
import { Interaction }              from '../source/event/interaction/interaction.js'
import { Message }                  from '../source/event/message/message.js'
import { TaskManager }              from '../source/task/taskManager.js'
import { MercyTracker }             from '../source/command/mercy/system/mercy.js'
import { Cluster }                  from '../database/cluster/cluster.js'
import { ClanManagement }              from '../source/command/clan/system/clan.js'

log.admin('Initiating startup sequence');


class Bot
{
    constructor()
    {
        log.setLevel('trace')

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

        this.registry       = new Registry(this.client);
        this.dispatcher     = new Dispatcher(this.client);
        this.interaction    = new Interaction(this.client, this.registry);
        this.message        = new Message(this.client, this.registry)
        this.scheduler      = new TaskManager(this.client, this.cluster, this.registry);

        this.mercyTracker   = new MercyTracker(this.client, this.cluster, this.registry);
        this.clanManagement = new ClanManagement(this.client, this.cluster, this.registry);
        this.deploy         = true; // Deploy commands?
    }
    

    async initialize()
    {
        await this.dispatcher.setContext(this);
        await this.dispatcher.registerEvents();
        await this.dispatcher.registerClient(this.interaction.create);
        await this.dispatcher.registerClient(this.message.create);

        await this.registry.registerModules();
        await this.registry.deployCommands(this.deploy);

        await this.scheduler.registerTasks();

        this.engage();
    }

    async engage()
    {
        await this.login()
    }

    async login()
    {
        await this.client.login(config.token);
        await this.registry.registerGuild();
    }

    shutdown()
    {
        log.admin('Powering down..')
    }


}


export { Bot }

