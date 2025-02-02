import config from "../environment/config.json" with { type: "json" };

import { Client, Collection, GatewayIntentBits } from 'discord.js';
import { log } from "../utility/logger/log.js";

import { ModuleLoader } from "./module/moduleLoader.js"


class Bot
{
    constructor()
    {
        this.client;
        this.registry;

        this.eventManager;
    }

    async initialize()
    {
        log.setlogLevel("Trace");

        this.client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent,
            ],
        });

        this.registry = 
        {
            command:    new Collection(),
            button:     new Collection(),
            menu:       new Collection(),
            modal:      new Collection(),
            filter:     new Collection(),
        }

        await ModuleLoader.events(this.client, this.registry)
        await ModuleLoader.commands(this.client, this.registry);
        await ModuleLoader.components(this.client, this.registry);
        await ModuleLoader.deployCommands(this.client, this.registry);

    }
    
    
    async engage()
    {
        log.system("All systems online. Engage!")
        this.client.login(config.token);
    }


    async shutdown()
    {
        log.system("Powering down..")
    }


}

export { Bot }