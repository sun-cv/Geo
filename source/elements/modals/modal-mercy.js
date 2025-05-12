import { MessageFlags, TextInputStyle }         from 'discord.js'
import { Component, Flags, Input, navigate, Schema }   from '#utils'


const flag = Flags.from({ autoload: true })

const data = 
{

    'account-add': Schema.modal
    ({
        meta: { id: `modal-mercy-account-add` },

        flag:
        {
            update:             true,
        },

        load: function(interaction)
        {
            return Component
                .modal  (this.meta.id)
                .title  ('Create account')
                .addTextInput('account_name', 'Enter your new account name:', TextInputStyle.Short, true)
                .build();
        },

        execute: function(interaction) 
        {
            const { mercy }                     = interaction.client
            const { account_name }              = Input.modal(interaction);

            const member                        = mercy.initialize(interaction);

            if (member.account.cache.has(account_name))
            {
                return interaction.editReply({ content: `${account_name} already exists`, flags: MessageFlags.Ephemeral });
            }

            member.account.create(account_name);
            member.account.updateAccounts();
            member.update();
            
            navigate.member(member).return(interaction);
        }
    }),
    
    'account-delete': Schema.modal
    ({
        meta: { id: 'modal-mercy-account-delete' },
       
        flag:
        {
            update:             true,
        },

        load: function(interaction)
        {
            return Component
                .modal  (this.meta.id)
                .title  ('Delete account')
                .addTextInput('account_name', 'Confirm deletion by entering account name:', TextInputStyle.Short, true, "WARNING - this cannot be undone")
                .build();
        },

        execute: function(interaction) 
        {
            const { mercy }                     = interaction.client
            const { account_name }              = Input.modal(interaction);

            const member                        = mercy.initialize(interaction);
            if (!member.account.cache.has(account_name))
            {
                return interaction.followUp({ content: `${account_name} was not found`, flags: MessageFlags.Ephemeral });
            }
            if (member.account.cache.get(account_name).main)
            {
                return interaction.followUp({content: `You cannot delete your current 'main' account. Please set a new 'main' account before proceeding.\n\nIf you'd prefer to delete all your Mercy data, there's no action required—it will automatically expire in 90 days.`, flags: MessageFlags.Ephemeral })
            }
            member.account.delete(account_name);
            member.update();
           
            navigate.member(member).return(interaction);
        }
    }),

        'account-name': Schema.modal
    ({
        meta: { id: `modal-mercy-account-name` },

        flag:
        {
            update:             true,
        },

        load: function(interaction)
        {
            return Component
                .modal  (this.meta.id)
                .title  ('Change name')
                .addTextInput('account_name', 'Enter your new account name:', TextInputStyle.Short, true)
                .build();
        },

        execute: function(interaction) 
        {
            const { mercy }                     = interaction.client
            const { account_name }              = Input.modal(interaction);

            const member                        = mercy.initialize(interaction);
            const account                       = member.account.getActive()

            if (member.account.cache.has(account_name))
            {
                return interaction.editReply({ content: `${account_name} already exists`, flags: MessageFlags.Ephemeral });
            }

            account.alias(account_name);
            
            member.updateAccountsCache(account)

            navigate.member(member).return(interaction);
        }
    }),
}

export { flag }
export default data