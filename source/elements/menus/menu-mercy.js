import fs                                                           from 'fs';
import path                                                         from 'path';
import { MessageFlags }                                             from 'discord.js';
import { Component, EmbedManager, navigate, Schema, Text, Input }   from '#utils';
import templates                                                    from '#resources/env/directory-template.json' with { type: 'json'}




const data = 
{
    'select-account': Schema.menu
    ({
        meta: { id: 'menu-mercy-select-account' },
    
        flag:
        {
            navigation: true,
        },
        
        load: function(interaction)
        {
            const { mercy } = interaction.client  
        
            const member    = mercy.initialize(interaction);
            const sorted    = [...member.account.cache.values()].sort((a,b) => b.main - a.main);
        
            return Component
                .menu(this.meta.id)
                .placeholder('Select account to manage')
                .values(1, 1)
                .arrayOptions(sorted.map((account) => account.name))
        },
    
        execute: function(interaction) 
        {
            const { mercy }         = interaction.client;
            const [ account_name ]  = Input.menu(interaction);
            const member            = mercy.initialize(interaction);
        
            if (account_name)
            {
                const account       = member.account.get(account_name);
            }

            interaction.editReply(EmbedManager.set(interaction).load('embed-mercy-account-home').create())
        }
    }),

    'select-template-static': Schema.menu
    ({
        meta: { id: 'menu-account-select-template-static' },
            
        load: function(interaction)
        {
            const files = fs.readdirSync(templates.directory)
                .filter(file => file.endsWith('.png'))
                .map(file => path.parse(file).name);
        
            return Component
                .menu(this.meta.id)
                .placeholder('Select a static template')
                .values(1, 1)
                .arrayOptions(files)
        },
    
        execute: function(interaction) 
        {
            const { mercy }         = interaction.client;
            const template          = Input.menu(interaction);

            const member            = mercy.initialize(interaction);
            const account           = member.account.getActive();

            account.data.template.selection.static = template
            account.update()

            interaction.editReply(EmbedManager.set(interaction).load('embed-account-template-home').create())
            interaction.followUp({content: 'Template successfully set' , flags: MessageFlags.Ephemeral})
        }
    }),

    'select-template-rotate': Schema.menu
    ({
        meta: { id: 'menu-account-select-template-rotate' },

        load: function(interaction)
        {
            const files = fs.readdirSync(templates.directory)
                .filter(file => file.endsWith('.png'))
                .map(file => path.parse(file).name);
        
            return Component
                .menu(this.meta.id)
                .placeholder('Select templates to rotate')
                .values(1, 25)
                .arrayOptions(files)
        },
    
        execute: function(interaction) 
        {
            const { mercy }         = interaction.client;
            const templates         = Input.menu(interaction);

            const member            = mercy.initialize(interaction);
            const account           = member.account.getActive();

            account.data.template.selection.rotate = templates
            account.update()

            interaction.editReply(EmbedManager.set(interaction).load('embed-account-template-home').create())
            interaction.followUp({content: 'Templates successfully set' , flags: MessageFlags.Ephemeral})

        }
    }),

        'select-template-custom': Schema.menu
    ({
        meta: { id: 'menu-account-select-template-custom' },
    
        load: function(interaction)
        {
            const files = fs.readdirSync(templates.directory)
                .filter(file => file.endsWith('.png'))
                .map(file => path.parse(file).name);
        
            return Component
                .menu(this.meta.id)
                .placeholder('Select templates to randomize')
                .values(1, 25)
                .arrayOptions(files)
        },
    
        execute: function(interaction) 
        {
            const { mercy }         = interaction.client;
            const templates         = Input.menu(interaction);

            const member            = mercy.initialize(interaction);
            const account           = member.account.getActive();

            account.data.template.selection.custom = templates
            account.update()

            interaction.editReply(EmbedManager.set(interaction).load('embed-account-template-home').create())
            interaction.followUp({content: 'Templates successfully set' , flags: MessageFlags.Ephemeral})
        }
    })
}


export default data;