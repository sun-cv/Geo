import config from '../../environment/config.json' with { type: 'json' }

import { REST, Routes, Collection } from 'discord.js';
import path                         from 'node:path';
import lodash                       from 'lodash';
import { log, FileManager }         from '../../utility/index.js'

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
            task:           path.join(this.root, "source", "tasks", "task"),
        }

        this.client         = client;

        // Bot cache
        this.autocomplete   = new Collection();
        this.command        = new Collection();
        this.button         = new Collection();
        this.menu           = new Collection();
        this.modal          = new Collection();
        this.filter         = new Collection();
        this.task           = new Collection();

        // Guild
        this.guild          = null;
        this.role           = new Collection();

        // Mercy Tracker
        this.member         = new Collection();
        this.account        = new Collection();

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

        log.admin("Successfully loaded registry data")
    }

    async loadAutocomplete()
    {
        await FileManager.loadDirectory(this.directory.autocomplete, (data) => this.registerAutocomplete(data));
    }

    async loadCommands()
    {
        await FileManager.loadDirectory(this.directory.command, (data) => this.registerCommand(data));
    }

    async loadButtons()
    {
        await FileManager.loadDirectory(this.directory.button,  (data) => this.registerComponent(data, "button"));
    }

    async loadMenus()
    {
        await FileManager.loadDirectory(this.directory.menu,    (data) => this.registerComponent(data, "menu"));
    }

    async loadModals()
    {
        await FileManager.loadDirectory(this.directory.modal,   (data) => this.registerComponent(data, "modal"));
    }

    async loadFilters()
    {
        await FileManager.loadDirectory(this.directory.filter,  (data) => this.registerFilter(data));
    }

    async loadTasks()
    {
        await FileManager.loadDirectory(this.directory.task, (data) => this.registerTask(data))
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
        if (task.flag.ignore)
        {
            log.trace(`${task.meta.id} load flag set to ignore`);
            return;
        }
        this.task.set(task.meta.id, task);

        log.debug(`Registered task: ${task.meta.id}`)
    }

    async deployCommands(enabled)
    {
        if (enabled)
        {
            const commandData = [];

            for (const entry of this.command.values())
            {
                commandData.push(entry.data);
                log.debug(`Redeploying command: ${entry.meta.id}`)
            }

		    const rest = new REST().setToken(config.token);

		    const data = await rest.put
            (
		    	Routes.applicationGuildCommands(config.clientID, config.guildID),
		    	{ body: commandData },
		    );

		    log.admin(`Successfully loaded ${data.length}/${this.command.size} application (/) commands.`);
        }        
    }

    
    async identify(interaction) {
        if (interaction.isAutocomplete()) 
        {
            interaction.data = lodash.cloneDeep(this.autocomplete.get(interaction.options._hoistedOptions.filter(option => option.focused).at(-1).name));
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
    
    async registerGuild()
    {
        const guild = await this.client.guilds.fetch(config.guildID);
        const roles = await guild.roles.fetch();

        this.guild = guild;
        roles.map((role) => this.role.set(role.name, role))
    }

    
}


export { Registry }