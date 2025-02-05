import { REST, Routes, Collection }     from 'discord.js';
import path                     from 'node:path';

import config from '../../environment/config.json' with { type: 'json' }

import { log, FileManager } from '../../utility/index.js'

class Registry
{
    constructor(client)
    {
        this.root       = process.cwd()
        this.directory  = 
        {
            system:     path.join(this.root, "source", "system"),
            event:      path.join(this.root, "source", "event"),
            command:    path.join(this.root, "source", "command"),
            button:     path.join(this.root, "source", "component", "button"),
            menu:       path.join(this.root, "source", "component", "menu"),
            modal:      path.join(this.root, "source", "component", "modal"),
            filter:     path.join(this.root, "source", "filter"),
            task:       path.join(this.root, "source", "task"),
        }

        this.client     = client;

        this.command    = new Collection();
        this.button     = new Collection();
        this.menu       = new Collection();
        this.modal      = new Collection();
        this.filter     = new Collection();
        this.tasks      = new Collection();
    }

    async registerModules()
    {
        await this.loadCommands();
        await this.loadButtons()
        await this.loadMenus();
        await this.loadModals();
        await this.loadFilters();
        await this.loadTasks();
        
        log.system("Registry data loaded successfully")
    }

    async loadCommands()
    {
        await FileManager.loadDirectory(this.directory.command, (object) => this.registerCommand(object));
    }

    async loadButtons()
    {
        await FileManager.loadDirectory(this.directory.button,  (object) => this.registerComponent(object, "button"));
    }

    async loadMenus()
    {
        await FileManager.loadDirectory(this.directory.menu,    (object) => this.registerComponent(object, "menu"));
    }

    async loadModals()
    {
        await FileManager.loadDirectory(this.directory.modal,   (object) => this.registerComponent(object, "modal"));
    }

    async loadFilters()
    {
        await FileManager.loadDirectory(this.directory.filter,  (object) => this.registerFilter(object));
    }

    async loadTasks()
    {
        await FileManager.loadDirectory(this.directory.task, this.registerTask)
    }

    
    async registerCommand(command) 
    {
        if (command.flag.ignore) 
        {
            return;
        }  
        this.command.set(command.meta.id, command);

        log.trace(`Registered command: ${command.meta.id}`)
    }
    
    async registerComponent(components, type)
    {
        for (const [id, component] of Object.entries(components))
        {
            if (component.flag.ignore)
            {
                return;
            }
            this[type].set(id, component);

            log.trace(`Registered component: ${id}`)
        }
    }

    async registerFilter(filter)
    {
        // TBD
    }

    async registerTask(task)
    {
        // TBD
    }

    async deployCommands()
    {

        const commandData = [];

        for (const entry of this.command.values())
        {
            commandData.push(entry.data);
        }

		const rest = new REST().setToken(config.token);

		const data = await rest.put
        (
			Routes.applicationGuildCommands(config.clientId, config.guildId),
			{ body: commandData },
		);
		log.system(`Successfully reloaded ${data.length}/${this.command.size} application (/) commands.`);
    }

}


export { Registry }