import { TextInputStyle }                           from 'discord.js';
import { Component, EmbedManager, Input, Schema }   from '#utils';
import { clanConfig }                               from '#commands/clan/config/clan.js';



const data = 
{

    'clan-update-membercount': Schema.modal
    ({
        meta: { id: `modal-clan-update-membercount` },

        flag:
        {
            update:             true,
        },

        load: function(interaction)
        {
            return Component
                .modal  (this.meta.id)
                .title  ('Member Count')
                .addTextInput('count', 'Enter the current member count', TextInputStyle.Short, true, "1-30")
                .build();
        },

        execute: function(interaction) 
        {
            const { member, client: { clanManagement: { cache: { clones, selection } }} } = interaction;
            const { count }     = Input.modal(interaction);

            const clan          = clones.get(member.id)
            clan.member.count   = count;

            interaction.editReply(EmbedManager.set(interaction).load('embed-clan-management-home').modify(getModifier(selection.get(member.id))).create());
        }
    }),
   

    'clan-update-tag': Schema.modal
    ({
        meta: { id: `modal-clan-update-tag` },

        flag:
        {
            update:             true,
        },

        load: function(interaction)
        {
            return Component
                .modal  (this.meta.id)
                .title  ('Tag')
                .addTextInput('value', 'Enter the new clan tag', TextInputStyle.Short, true)
                .build();
        },

        execute: function(interaction) 
        {
            const { member, client: { clanManagement: { cache: { clones, selection } }} } = interaction;
            const { value }       = Input.modal(interaction);

            const clan          = clones.get(member.id)
            clan.tag            = value

            interaction.editReply(EmbedManager.set(interaction).load('embed-clan-management-home').modify(getModifier(selection.get(member.id))).create());
        }
    }),


    'clan-update-level': Schema.modal
    ({
        meta: { id: `modal-clan-update-level` },

        flag:
        {
            update:             true,
        },

        load: function(interaction)
        {
            return Component
                .modal  (this.meta.id)
                .title  ('Clan level')
                .addTextInput('level', 'Enter the current clan level', TextInputStyle.Short, true)
                .build();
        },

        execute: function(interaction) 
        {
            const { member, client: { clanManagement: { cache: { clones, selection } }} } = interaction;
            const { level }     = Input.modal(interaction);
            
            const clan          = clones.get(member.id)
            clan.level          = level;

            interaction.editReply(EmbedManager.set(interaction).load('embed-clan-management-home').modify(getModifier(selection.get(member.id))).create());
        }
    }),


    'clan-update-clanboss-custom': Schema.modal
    ({
        meta: { id: 'modal-clan-update-clanboss-custom' },

        flag:
        {
            update:             true,
        },

        load: function(interaction)
        {
            return Component
                .modal  (this.meta.id)
                .title  ('Custom recruiting message')
                .addTextInput('message', 'Enter your custom message', TextInputStyle.Short, true)
                .build();
        },

        execute: function(interaction) 
        {
            const { member, client: { clanManagement: { cache: { clones, selection } }} } = interaction;
            const { message }   = Input.modal(interaction);

            const clan          = clones.get(member.id)
            clan.recruitment.clanboss.custom    = message;

            interaction.editReply(EmbedManager.set(interaction).load('embed-clan-management-home').modify(getModifier(selection.get(member.id))).create());
        }
    }),    
    

    'clan-update-hydra-custom': Schema.modal
    ({
        meta: { id: 'modal-clan-update-hydra-custom' },

        flag:
        {
            update:             true,
        },

        load: function(interaction)
        {
            return Component
                .modal  (this.meta.id)
                .title  ('Custom recruiting message')
                .addTextInput('message', 'Enter your custom message', TextInputStyle.Short, true)
                .build();
        },

        execute: function(interaction) 
        {
            const { member, client: { clanManagement: { cache: { clones, selection } }} } = interaction;
            const { message }   = Input.modal(interaction);

            const clan          = clones.get(member.id)
            clan.recruitment.hydra.custom    = message;

            interaction.editReply(EmbedManager.set(interaction).load('embed-clan-management-home').modify(getModifier(selection.get(member.id))).create());
        }
    }),    
    
    'clan-update-chimera-custom': Schema.modal
    ({
        meta: { id: 'modal-clan-update-chimera-custom' },

        flag:
        {
            update:             true,
        },

        load: function(interaction)
        {
            return Component
                .modal  (this.meta.id)
                .title  ('Custom recruiting message')
                .addTextInput('message', 'Enter your custom message', TextInputStyle.Short, true)
                .build();
        },

        execute: function(interaction) 
        {
            const { member, client: { clanManagement: { cache: { clones, selection } }} } = interaction;
            const { message }   = Input.modal(interaction);
            
            const clan          = clones.get(member.id)
            clan.recruitment.chimera.custom    = message;

            interaction.editReply(EmbedManager.set(interaction).load('embed-clan-management-home').modify(getModifier(selection.get(member.id))).create());
        }
    }),

    'clan-update-cvc-custom': Schema.modal
    ({
        meta: { id: 'modal-clan-update-cvc-custom' },

        flag:
        {
            update:             true,
        },

        load: function(interaction)
        {
            return Component
                .modal  (this.meta.id)
                .title  ('Custom recruiting message')
                .addTextInput('message', 'Enter your custom message', TextInputStyle.Short, true)
                .build();
        },

        execute: function(interaction) 
        {
            const { member, client: { clanManagement: { cache: { clones, selection } }} } = interaction;
            const { message }   = Input.modal(interaction);
            
            const clan          = clones.get(member.id)
            clan.recruitment.cvc.custom    = message;

            interaction.editReply(EmbedManager.set(interaction).load('embed-clan-management-home').modify(getModifier(selection.get(member.id))).create());
        }
    }),


    'clan-update-siege-custom': Schema.modal
    ({
        meta: { id: 'modal-clan-update-siege-custom' },

        flag:
        {
            update:             true,
        },

        load: function(interaction)
        {
            return Component
                .modal  (this.meta.id)
                .title  ('Custom recruiting message')
                .addTextInput('message', 'Enter your custom message', TextInputStyle.Short, true)
                .build();
        },

        execute: function(interaction) 
        {
            const { member, client: { clanManagement: { cache: { clones, selection } }} } = interaction;
            const { message }   = Input.modal(interaction);
            
            const clan          = clones.get(member.id)
            clan.recruitment.siege.custom    = message;

            interaction.editReply(EmbedManager.set(interaction).load('embed-clan-management-home').modify(getModifier(selection.get(member.id))).create());
        }
    }),

    'clan-update-recruitment-message': Schema.modal
    ({
        meta: { id: 'modal-clan-update-recruitment-message' },

        flag:
        {
            update:             true,
        },

        load: function(interaction)
        {
            return Component
                .modal  (this.meta.id)
                .title  ('Custom recruiting message')
                .addTextInput('message', 'Enter your custom message', TextInputStyle.Paragraph, true)
                .build();
        },

        execute: function(interaction) 
        {
            const { member, client: { clanManagement: { cache: { clones, selection } }} } = interaction;
            const { message }   = Input.modal(interaction);
            
            const clan          = clones.get(member.id)
            clan.recruitment.message = message;

            interaction.editReply(EmbedManager.set(interaction).load('embed-clan-management-home').modify(getModifier(selection.get(member.id))).create());
        }
    }),

}

function getModifier(selection)
{
    return (data) => 
    {
        data.row.pop()
        data.row.push(clanConfig.element.selection[selection]);
    }
}

export default data