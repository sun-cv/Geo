import config from "../environment/config.json" with { type: "json" };

import { Client, GatewayIntentBits } from 'discord.js';
import { log } from "../utility/logger/log.js";

import { Registry } from './registry/registry.js'

class Bot
{
    constructor()
    {
        this.client;
        this.registry;

        this.construct();
    }

    async construct()
    {
        log.system("Initiating startup sequence");

        this.client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent,
            ],
        });
        
        this.registry           = new Registry(this.client);
        
        
    }
    
    async initialize()
    {
        log.setLevel("trace");

        await this.systemEvents();
        await this.registry.loadRegistryModules();

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