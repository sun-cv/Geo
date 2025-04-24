import config from '../../env/secret/credentials.json' with { type: 'json' }

import { REST, Routes, Collection } from 'discord.js';
import path                         from 'node:path';
import lodash                       from 'lodash';
import { log, FileManager, Schema }         from '../../utility/index.js'

class Registry
{
    constructor(client)
    {
        this.root       = process.cwd()
        this.directory  = 
        {
            system:         path.join(this.root, "source", "system"             ),
            event:          path.join(this.root, "source", "event"              ),
            autocomplete:   path.join(this.root, "source", "autocomplete"       ),
            command:        path.join(this.root, "source", "command"            ),
            embed:          path.join(this.root, "source", "element"  , "embed" ),
            button:         path.join(this.root, "source", "element"  , "button"),
            menu:           path.join(this.root, "source", "element"  , "menu"  ),
            modal:          path.join(this.root, "source", "element"  , "modal" ),
            filter:         path.join(this.root, "source", "filter"             ),
            task:           path.join(this.root, "source", "task"               )
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
        this.task           = new Collection();
        
        this.filter         = 
        {
            member:           new Collection(),
            content:          new Collection(),
            channel:          new Collection(),
        }

        // Guild
        this.guild          = null;
        this.role           = new Collection();
        this.channels       = new Collection();

        // Mercy Tracker
        this.member         = new Collection();
        this.account        = new Collection();

        // interaction cache
        this.modal.cache    = new Collection();


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
        if (autocomplete.flag.ignore.get())
        {
            log.trace(`${command.meta.id} load flag set to ignore.`)
            return;
        }  
        this.autocomplete.set(autocomplete.meta.id, autocomplete);

        log.trace(`Registered autocomplete: ${autocomplete.meta.id}`)   
    }

    
    async registerCommand(command) 
    {

        if (command.flag.ignore.get()) 
        {
            log.trace(`${command.meta.id} load flag set to ignore.`)
            return;
        }  
        this.command.set(command.meta.id, command);

        log.trace(`Registered command: ${command.meta.id}`);
    }
    

    async registerEmbed(data)
    {
        for (const embed of Object.values(data))
        {
            if (embed.flag.ignore.get())
            {
                log.trace(`${embed.meta.id} load flag set to ignore`);
            }
            this.embed.set(embed.meta.id, embed);

            log.trace(`Registered embed: ${embed.meta.id}`);
        }
    }


    async registerButton(data)
    {
        for (const button of Object.values(data))
        {            
            if (button.flag.ignore.get())
            {
                log.trace(`${id} load flag set to ignore.`);
                continue;
            }
            this.button.set(button.meta.id, button);

            log.trace(`Registered button: ${button.meta.id}`);
        }
    }


    async registerMenu(data)
    {
        for (const menu of Object.values(data))
            {            
                if (menu.flag.ignore.get())
                {
                    log.trace(`${id} load flag set to ignore.`);
                    continue;
                }
                this.menu.set(menu.meta.id, menu);
    
                log.trace(`Registered menu: ${menu.meta.id}`);
            }
    }


    async registerModal(data)
    {
        for (const modal of Object.values(data))
        {            
            if (modal.flag.ignore.get())
            {
                log.trace(`${id} load flag set to ignore.`);
                continue;
            }
            this.modal.set(modal.meta.id, modal);

            log.trace(`Registered modal: ${modal.meta.id}`);
        }
    }


    async registerFilter(filter)
    {

        const { condition, condition: { scopes } } = filter

        for (const scope of scopes)
        {
            if (condition.include[scope].length)
            {
                for (const value of condition.include[scope])
                {
                    if (!this.filter[scope].has(value))
                    {
                        this.filter[scope].set(value, new Collection)
                    }
                    this.filter[scope].get(value).set(filter.meta.id, filter)
                }
            }        
        }

        log.trace(`Registered filter: ${filter.meta.id}`);
    }


    async registerTask(task)
    {

        if (task.flag.ignore.get())
        {
            log.trace(`${task.meta.id} load flag set to ignore`);
            return;
        }
        this.task.set(task.meta.id, task);

        log.trace(`Registered ${task.meta.category} task: ${task.meta.id}`);
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

    
    async loadInteractionData(interaction) 
    {
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

    async loadMessageData(message)
    {
        message.data = Schema.message({ meta: { id: message.id }});
    }
    
    async registerGuild()
    {
        const guild = await this.client.guilds.fetch(config.guildID);
        const roles = await guild.roles.fetch();

        this.guild = guild;
        roles.map((role) => this.role.set(role.name, role))
        
        this.mapChannels();
    }

    async mapChannels() 
    {
        if (!this.guild) 
        {
            log.error("Guild not set, cannot map channels");
            return;
        }
    
        this.channels = new Collection();
    
        this.guild.channels.cache.forEach(channel => 
        {
            if (channel && channel.name && channel.id) 
            {
                this.channels.set(channel.name.toLowerCase(), channel);
                this.channels.set(channel.id, channel);
            }
        });
    
        log.trace(`Mapped ${this.channels.size} channels in registry.channels`);
    }
    

}

export { Registry }