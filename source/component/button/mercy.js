import { ButtonBuilder } from "@discordjs/builders";
import { Component } from "../../../utility/index.js";

const data = 
{
    meta: 
    {
        id:             "Account button collection",
        type:           "button",
        description:    "Mercy tracker button collection",
    },

    flag: 
    {
        ignore: false
    },

    button:
    {
        "mercy-account-add": 
        {
            meta: 
            {
                id:                 "mercy-account-add",
                type:               "button",
                description:        "Mercy tracker account management: add account"
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
                    roles:          []
                }
            },

            flag:
            {
                ignore:             false,
                defer:              false,
                maintenance:        false,
            },

            load:                () => 
            {
                return Component
                    .button ('mercy-account-add')
                    .label  ('Add Account')
                    .style  ('Success')
            },

            execute: async function (interaction) 
            {
                const { client: { registry }, member } = interaction;
            
                const modal = registry.modal.get(this.meta.id);
                registry.modal.cache.set(member.id, interaction.customId);

                await interaction.showModal(modal.load());
            }
            

        },

        "mercy-account-delete": 
        {
            meta: 
            {
                id:                 "mercy-account-delete",
                type:               "button",
                description:        "Mercy tracker account management: delete account"
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
                    roles:          []
                }   
            },  

            flag:   
            {   
                ignore:             false,
                defer:              false,
                maintenance:        false,
            },  

            load:                () => 
                {

                    return Component
                        .button ('mercy-account-delete')
                        .label  ('Delete Account')
                        .style  ('Secondary')
                },

                execute: async function (interaction) 
                {
                    const { client: { registry }, member } = interaction;

                    const modal = registry.modal.get(this.meta.id);

                    registry.modal.cache.set(member.id, interaction.customId);
                    
                    await interaction.showModal(modal.load());
                }
        }
    }
}

export default data;