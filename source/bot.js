import config from "../environment/config.json" with { type: "json" };

import { Client, GatewayIntentBits } from 'discord.js';
import { log } from "../utility/logger/log.js";

import { Registry } from './registry/registry.js'
import { Dispatcher } from './event/dispatcher.js'
import { Interaction } from "./interaction/interaction.js";

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
        
        this.registry    = new Registry(this.client);
        this.dispatcher  = new Dispatcher(this.client);
        this.interaction = new Interaction(this.client, this.registry)
    }
    

    async initialize()
    {
        log.setLevel("System");

        log.system("Initiating startup sequence");

        await this.dispatcher.setContext(this);
        await this.dispatcher.registerEvents();
        await this.dispatcher.registerClient(this.interaction.create);

        await this.registry.registerModules();
        await this.registry.deployCommands(); // Move to command handler?



    }

    async engage()
    {
        await this.client.login(config.token);
    }

    async systemEvents()
    {
        process.on("SIGINT", this.shutdown);
        process.on("SIGTERM", this.shutdown);
    }

    async shutdown()
    {
        log.system("Powering down..")
        process.exit(0);
    }


}

export { Bot }