import { Component, EmbedManager, Schema }  from "../../../utility/index.js";
import { Text, Input }                      from "../../../utility/index.js";

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
                .arrayOptions(sorted.map((account) => account.account))
        },
    
        execute: function(interaction) 
        {
            const { mercy }         = interaction.client;
            const [account_name]    = Input.menu(interaction);
        
            const member            = mercy.initialize(interaction);
            const account           = member.account.get(account_name);
            account.setActive();
        
            interaction.editReply(EmbedManager.set(interaction).load('mercy-account-settings').create())
        }
    })
}


export default data;