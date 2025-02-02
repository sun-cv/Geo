import fs               from 'node:fs';
import path             from 'node:path';
import { REST, Routes } from 'discord.js';
import { log }          from '../../utility/index.js';
import config           from '../../environment/config.json' with { type: "json" };

import { FileManager }  from '../../utility/toolkit/modules/fileManager.js';


const baseDir = path.resolve('source');

const moduleFolder = 
{
    events:     path.join(baseDir, "event"),
    commands:   path.join(baseDir, "command"),
    components: path.join(baseDir, "component")
};

class ModuleLoader
{
    static async events(client, registry)
    {
        await FileManager.loadRecursive(moduleFolder.events, registerListener, client, registry);
    }

    static async commands(client, registry)
    {
        await FileManager.loadRecursive(moduleFolder.commands, registerComponent, registry);
    }

    static async components(client, registry)
    {
        await FileManager.loadRecursive(moduleFolder.components, registerComponent, registry);
    }

    static async deployCommands(client, registry)
    {
        await deployCommands(registry);
    }
}


async function registerListener(event, client, registry) 
{
	if (event.flag.once) 
    {
		client.once(event.meta.name, (...args) => event.execute(client, ...args));
	}
	else 
    {
		client.on(event.meta.name, (...args) => event.execute(client, registry, ...args));
	}
	log.trace(`Registered ${event.meta.name}`)
}


async function registerComponent(component, registry) 
{
	if (component.flag.ignore) 
    {
        return;
    }  
    registry[component.meta.type].set(component.meta.id, component)
}

async function deployCommands(registry)
{
	try {

        const commandData = []

        for (const command of registry.command.values())
        {
            commandData.push(command.data);
        }

		const rest = new REST().setToken(config.token);
		const data = await rest.put
        (
			Routes.applicationGuildCommands(config.clientId, config.guildId),
			{ body: commandData },
		);

		log.system(`Reloaded ${commandData.length}/${registry.command.size} (/) commands.`);
	}
	catch (error) {
		log.error(error);
	}
}



export { ModuleLoader }