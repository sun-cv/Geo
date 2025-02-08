import { REST, Routes, Collection }     from 'discord.js';
import path                     from 'node:path';

import config from '../../environment/config.json' with { type: 'json' }
import lodash from 'lodash';
import { log, FileManager } from '../../utility/index.js'

class Registry
{
    constructor(client)
    {
        this.root       = process.cwd()
        this.directory  = 
        {
            system:         path.join(this.root, "source", "system"),
            event:          path.join(this.root, "source", "event"),
            autocomplete:   path.join(this.root, "source", "autocomplete"),
            command:        path.join(this.root, "source", "command"),
            button:         path.join(this.root, "source", "component", "button"),
            menu:           path.join(this.root, "source", "component", "menu"),
            modal:          path.join(this.root, "source", "component", "modal"),
            filter:         path.join(this.root, "source", "filter"),
            task:           path.join(this.root, "source", "task"),
        }

        this.client         = client;

        this.autocomplete   = new Collection();
        this.command        = new Collection();
        this.button         = new Collection();
        this.menu           = new Collection();
        this.modal          = new Collection();
        this.filter         = new Collection();
        this.tasks          = new Collection();
    }


    async registerModules()
    {
        await this.loadAutocomplete();
        await this.loadCommands();
        await this.loadButtons()
        await this.loadMenus();
        await this.loadModals();
        await this.loadFilters();
        await this.loadTasks();
        
        log.admin("Registry data loaded successfully")
    }

    async loadAutocomplete()
    {
        await FileManager.loadDirectory(this.directory.autocomplete, (object) => this.registerAutocomplete(object));
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

    async registerAutocomplete(autocomplete)
    {
        if (autocomplete.flag.ignore) 
        {
            return;
        }  
        this.autocomplete.set(autocomplete.meta.id, autocomplete);

        log.debug(`Registered autocomplete: ${autocomplete.meta.id}`)   
    }

    
    async registerCommand(command) 
    {
        if (command.flag.ignore) 
        {
            log.trace(`${command.meta.id} load flag set to ignore.`)
            return;
        }  
        this.command.set(command.meta.id, command);

        log.debug(`Registered command: ${command.meta.id}`)
    }
    
    async registerComponent(components, type)
    {
        for (const [id, component] of Object.entries(components))
        {
            if (component.flag.ignore)
            {
                log.trace(`${id} load flag set to ignore.`)
                return;
            }
            this[type].set(id, component);

            log.debug(`Registered component: ${id}`)
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
        try {
            
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
		log.admin(`Successfully reloaded ${data.length}/${this.command.size} application (/) commands.`);
            } catch (error) {
            console.log(error)
        }
    }

    
    async identify(interaction) {
        if (interaction.isAutocomplete()) 
        {
            interaction.data = lodash.cloneDeep(this.autocomplete.get(interaction.commandName));
        }
        if (interaction.isChatInputCommand()) 
        {
            interaction.data = lodash.cloneDeep(this.command.get(interaction.commandName));
        }
        if (interaction.isButton()) 
        {
            interaction.data = lodash.cloneDeep(this.button.get(interaction.customId));
        }
        if (interaction.isAnySelectMenu()) 
        {
            interaction.data = lodash.cloneDeep(this.menu.get(interaction.customId));
        }
        if (interaction.isModalSubmit()) 
        {
            interaction.data = lodash.cloneDeep(this.modal.get(interaction.customId));
        }
    }
    

    
}


export { Registry }