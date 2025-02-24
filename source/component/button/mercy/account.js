import { ButtonBuilder } from "@discordjs/builders";

const data = 
{
    meta: 
    {
        id:             "Account button collection",
        type:           "button",
        description:    "Mercy tracker account command button collection",
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
                defer:              true,
                maintenance:        false,
            },

            execute:                () => 
            {
                return new ButtonBuilder()
                    .setCustomId('mercy-account-add')
                    .setLabel   ('Add Account')
                    .setStyle   ('Success')
            }
        },

        "mercy-account-remove": 
    {
        meta: 
        {
            id:                 "mercy-account-remove",
            type:               "button",
            description:        "Mercy tracker account management: remove account"
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
            defer:              true,
            maintenance:        false 
        },  

        execute:                () => 
            {
                return new ButtonBuilder()
                    .setCustomId('mercy-account-delete')
                    .setLabel   ('Delete Account')
                    .setStyle   ('Secondary')
            }
        }
    }
}

export default data;