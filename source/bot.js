import config from "../configuration/secret/credentials.json" with { type: "json" };

import { Client, GatewayIntentBits, Options }   from 'discord.js';

import { log }                                  from "../utility/logger/log.js";
import { Registry }                             from './registry/registry.js'
import { Dispatcher }                           from './event/dispatcher.js'
import { Interaction }                          from "./interaction/interaction.js";
import { TaskManager }                          from "./task/taskManager.js";
import { Cluster }                              from "../database/cluster/cluster.js";
import { Mercy }                                from "./command/mercy/tracker/mercy.js";


log.admin("Initiating startup sequence");


class Bot
{
    constructor()
    {
        log.setLevel("Trace")

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
        this.scheduler      = new TaskManager(this.client, this.registry);

        this.mercy          = new Mercy(this.client, this.cluster, this.registry,)

        this.deploy        = true; // Deploy commands?
    }
    

    async initialize()
    {
        await this.dispatcher.setContext(this);
        await this.dispatcher.registerEvents();
        await this.dispatcher.registerClient(this.interaction.create);

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
        log.admin("Powering down..")
    }


}

export { Bot }