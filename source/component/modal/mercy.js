import { TextInputStyle } from "discord.js";
import { Component, Input } from "../../../utility/index.js";

const data = 
{
    meta: 
    {
        id:             "Mercy modal collection",
        type:           "modal",
        description:    "Mercy modal collection currently used for testing",
    },

    flag: 
    {
        ignore: false
    },

    modal:
    {
         "mercy-account-add": 
        {
            meta: 
            {
                id:                 "mercy-account-add",
                type:               "modal",
                description:        "Mercy tracker account management: add account by name"
            },

            access: 
            {
                cooldown:           0,
                permissions:        [],
                channels:           [],
                roles:              [],
                exclude:    
                {
                    permissions:    [],
                    channels:       [],
                    roles:          [],
                },
                timeout:            120
            },

            flag:
            {
                ignore:             false,
                defer:              true,
                maintenance:        false,
            },

            load: () => 
            {
                return Component
                    .modal  (`mercy-account-add`)
                    .title  ('Create account')
                    .addTextInput('account_name', 'Enter your new account name:', TextInputStyle.Short, true)
                    .build();
            },

            execute: async (interaction) => 
            {

                const { mercy }                     = interaction.client
                const { account_name }              = Input.modal(interaction);
  
                const member                        = mercy.initialize(interaction);

                





            }
        },

        "mercy-account-delete": 
        {
            meta: 
            {
                id:                 "mercy-account-delete",
                type:               "modal",
                description:        "Mercy tracker account management: delete account by name"
            },

            access: 
            {
                cooldown:           0,
                permissions:        [],
                channels:           [],
                roles:              [],
                exclude:    
                {
                    permissions:    [],
                    channels:       [],
                    roles:          [],
                },
                timeout:            120
            },

            flag:
            {
                ignore:             false,
                defer:              true,
                maintenance:        false,
            },

            load: () => 
            {
                return Component
                    .modal  (`mercy-account-delete`)
                    .title  ('Delete account')
                    .addTextInput('account', 'Confirm deletion by entering account name:', TextInputStyle.Short, true)
                    .build();
            },

            execute: async (interaction) => 
            {

                
            }
        }
    }
}


export default data;