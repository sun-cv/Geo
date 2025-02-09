import config from "../environment/config.json" with { type: "json" };

import { Client, GatewayIntentBits } from 'discord.js';
import { log } from "../utility/logger/log.js";

import { Registry } from './registry/registry.js'
import { Dispatcher } from './event/dispatcher.js'
import { Interaction } from "./interaction/interaction.js";
import { TaskManager } from "./tasks/taskManager.js";
import { cluster } from "../database/cluster.js";

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

        this.cluster     = cluster;

        this.registry    = new Registry(this.client);
        this.dispatcher  = new Dispatcher(this.client);
        this.interaction = new Interaction(this.client, this.registry)
        this.scheduler   = new TaskManager(this.client, this.registry)

        this.enabled     = false; // Deploy commands?
    }
    

    async initialize()
    {
        log.setLevel("Event");

        log.admin("Initiating startup sequence");

        await this.cluster.connect();

        await this.dispatcher.setContext(this);
        await this.dispatcher.registerEvents();
        await this.dispatcher.registerClient(this.interaction.create);

        await this.registry.registerModules();
        await this.registry.deployCommands(this.enabled);

        await this.scheduler.registerTasks();

    }

    async engage()
    {
        await this.client.login(config.token);
    }

    shutdown()
    {
        log.admin("Powering down..")
    }


}

export { Bot }