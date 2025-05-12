import { REST, Routes, Collection } from 'discord.js';
import path                         from 'node:path';
import lodash                       from 'lodash';
import config                       from '#env/secret/credentials.json' with { type: 'json' };
import directory                    from '#env/directory/path.json'     with { type: 'json' };
import global                       from '#env/constant/global.json'    with { type: 'json' };
import { log, FileManager, Schema } from '#utils';

class Registry
{
    constructor(client)
    {
        this.root       =   directory.root
        this.directory  = 
        {
            system:         path.join(this.root, "source", "system"                 ),
            event:          path.join(this.root, "source", "events"                 ),
            autocomplete:   path.join(this.root, "source", "autocomplete"           ),
            command:        path.join(this.root, "source", "commands"               ),
            embed:          path.join(this.root, "source", "elements"  , "embeds"   ),
            button:         path.join(this.root, "source", "elements"  , "buttons"  ),
            menu:           path.join(this.root, "source", "elements"  , "menus"    ),
            modal:          path.join(this.root, "source", "elements"  , "modals"   ),
            filter:         path.join(this.root, "source", "filters"                ),
            task:           path.join(this.root, "source", "tasks"                  )
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
        if (!autocomplete.flag.autoload.get())
        {
            log.trace(`${command.meta.id} autoload flag set to ignore.`)
            return;
        }  
        this.autocomplete.set(autocomplete.meta.id, autocomplete);

        log.trace(`Registered autocomplete: ${autocomplete.meta.id}`)   
    }

    
    async registerCommand(command) 
    {

        if (!command.flag.autoload.get()) 
        {
            log.trace(`${command.meta.id} autoload flag set to ignore.`)
            return;
        }  
        this.command.set(command.meta.id, command);

        log.trace(`Registered command: ${command.meta.id}`);
    }
    

    async registerEmbed(data)
    {
        for (const embed of Object.values(data))
        {
            if (!embed.flag.autoload.get())
            {
                log.trace(`${embed.meta.id} autoload flag set to ignore`);
            }
            this.embed.set(embed.meta.id, embed);

            log.trace(`Registered embed: ${embed.meta.id}`);
        }
    }


    async registerButton(data)
    {
        for (const button of Object.values(data))
        {            
            if (!button.flag.autoload.get())
            {
                log.trace(`${id} autoload flag set to ignore.`);
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
            if (!menu.flag.autoload.get())
            {
                log.trace(`${id} autoload flag set to ignore.`);
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
            if (!modal.flag.autoload.get())
            {
                log.trace(`${id} autoload flag set to ignore.`);
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

        if (!task.flag.autoload.get())
        {
            log.trace(`${task.meta.id} autoload flag set to ignore`);
            return;
        }
        this.task.set(task.meta.id, task);

        log.trace(`Registered ${task.meta.category} task: ${task.meta.id}`);
    }


    async deployCommands()
    {
        if (global.command)
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