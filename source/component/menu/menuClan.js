import { Component, EmbedManager, Schema }  from "../../../utility/index.js";
import { Text, Input }                      from "../../../utility/index.js";

const data = 
{
    'clan-info': Schema.menu
    ({
        meta: { id: 'menu-clan-info-select' },

    
        load: function(interaction)
        {
            const { clanCluster: { clan } } = interaction.client  
        
            const clans = Object.values(clan).sort((a, b) => a.tier - b.tier);

            return Component
                .menu(this.meta.id)
                .placeholder('Select clan for more info')
                .values(1, 1)
                .arrayOptions(clans.map((clan) => {return clan.clan}))
        },
    
        execute: function(interaction) 
        {
            
        }
    })
}


export default data;