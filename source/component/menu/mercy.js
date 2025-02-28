import { Component } from "../../../utility/index.js";


const data = 
{
    meta: 
    {
        id:             "Account menu collection",
        type:           "menu",
        description:    "Mercy tracker menu collection",
    },

    flag: 
    {
        ignore: false
    },

    menu:
    {
        "mercy-account-select": 
        {
            meta: 
            {
                id:                 "mercy-account-select",
                type:               "menu",
                description:        "Mercy tracker account management: select account menut"
            },

            flag:
            {
                ignore:             false,
                defer:              true,
                maintenance:        false,
                navigation:         true,
            },

            load:       (interaction) => 
            {
                const { mercy } = interaction.client  

                const member    = mercy.initialize(interaction);
                const sorted    = [...member.account.values()].sort((a,b) => b.main - a.main);

                return Component
                    .menu('mercy-account-select')
                    .placeholder("Select account")
                    .values(1, 1)
                    .arrayOptions(sorted.map((account) => account.account))
                    
            },
            execute:    (interaction) => 
            {
                
                
            
            }


        },
    }
}


export default data;