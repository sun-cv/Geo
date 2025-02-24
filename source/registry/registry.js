import config from '../../configuration/secret/credentials.json' with { type: 'json' }

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
            system:         path.join(this.root, "source", "system"                 ),
            event:          path.join(this.root, "source", "event"                  ),
            autocomplete:   path.join(this.root, "source", "autocomplete"           ),
            command:        path.join(this.root, "source", "command"                ),
            embed:          path.join(this.root, "source", "element"    , "embed"   ),
            button:         path.join(this.root, "source", "component"  , "button"  ),
            menu:           path.join(this.root, "source", "component"  , "menu"    ),
            modal:          path.join(this.root, "source", "component"  , "modal"   ),
            filter:         path.join(this.root, "source", "filter"                 ),
            task:           path.join(this.root, "source", "task"                   )
        }

        this.client         = client;

        // Bot cache
        this.autocomplete   = new Collection();
        this.command        = new Collection();
        this.button         = new Collection();
        this.menu           = new Collection();
        this.modal          = new Collection();
        this.embed          = new Collection();
        this.row            = new Collection();
        this.filter         = new Collection();
        this.task           = new Collection();

        // Guild
        this.guild          = null;
        this.role           = new Collection();

        // Mercy Tracker
        this.member         = new Collection();
        this.account        = new Collection();

        client.registry     = this;
    }


    async registerModules()
    {
        for (const module in this.directory)
        {
            log.debug(`Loading registry module: ${module}`)
            await this.load(module);
        }
        log.admin("Successfully loaded registry data")
    }


    async load(module)
    {
        const method = `register${module.charAt(0).toUpperCase() + module.slice(1)}`;
        
        if (typeof this[method] === 'function') 
        {
            await FileManager.loadDirectory(this.directory[module], (data) => this[method](data));
        } 
        else 
        {
            log.debug(`No loader method found for module: ${module}`);
        }
    }


    async registerAutocomplete(autocomplete)
    {
        if (autocomplete.flag.ignore) 
        {
            log.trace(`${command.meta.id} load flag set to ignore.`)
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

        log.debug(`Registered command: ${command.meta.id}`);
    }
    

    registerEmbed(data)
    {
        for (const embed of Object.values(data.embed))
        {
            if (embed.flag.igore)
            {
                log.trace(`${embed.meta.id} load flag set to ignore`);
            }
            this.embed.set(embed.meta.id, embed);

            log.debug(`Registered embed: ${embed.meta.id}`);
        }
    }


    async registerButton(data)
    {
        for (const button of Object.values(data.button))
        {            
            if (button.flag.ignore)
            {
                log.trace(`${id} load flag set to ignore.`);
                continue;
            }
            this.button.set(button.meta.id, button);

            log.debug(`Registered button: ${button.meta.id}`);
        }
    }


    async registerMenu(menus)
    {

    }


    async registerModal(modals)
    {

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

        log.debug(`Registered task: ${task.meta.id}`);
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