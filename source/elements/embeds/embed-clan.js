import { EmbedBuilder }         from '@discordjs/builders';
import { Embed, Flags, Schema, Text }  from '#utils';
import { template }             from '#resources/templates/template-clan.js';


const flag = Flags.from({ autoload: true })

const data = 
{
    'clan-application-landing': Schema.embed
    ({
        meta: 
        {
            id: 'embed-clan-application-landing'
        },
    
        row:
        [
            { button: ['button-application-info'] },
            { button: ['button-application-apply', 'button-application-transfer'] },
        ],
    
        load: function(interaction)
        {
            const { clanManagement: { clan } } = interaction.client;
            const clans = Object.values(clan).sort((a, b) => a.tier - b.tier);
                        
            const embed = new EmbedBuilder().setColor(0xED8223).setTitle(`${Text.set('Colred Plays: Raid: Shadow Legends Cluster').center(58, '⠀')}`)
    
            for (const [index, entry] of clans.entries()) 
            {
                if (index > 0 && index % 1 == 0) 
                {
                    Embed.set(embed).buffer(1, 1, false);
                }
                embed.addFields({ name: ' ', value: template.landing(entry), inline: true });
            }
    
            return embed;
        },
    
        execute: function() {}
    }),
    
    'clan-home': Schema.embed
    ({ 
        meta: 
        {
            id: 'embed-clan-home'
        },

        flag: 
        {
            navigation: true
        },

        row:
        [
            { menu: ['menu-clan-home-select'] }
        ],

        load: function(interaction)
        {
            const { clanManagement: { clan } } = interaction.client;
            const clans = Object.values(clan).sort((a, b) => a.tier - b.tier);
                        
            const embed = new EmbedBuilder().setColor(0xED8223).setTitle(`${Text.set('Colred Plays: Raid: Shadow Legends Cluster').center(58, '⠀')}`)

            for (const [index, clan] of clans.entries()) 
            {                
                if (index > 0 && index % 3 == 0) 
                {
                    Embed.set(embed).buffer(1, 1, false);
                }
                embed.addFields({ name: ' ', value: template.home(clan), inline: true });
            }

            return embed;
        },

        execute: function() {}
    }),

    'clan-management-home': Schema.embed
    ({
        meta: 
        {
            id: 'embed-clan-management-home'
        },

        flag: 
        {
            navigation: true,
        },

        row:
        [
            { button: ['button-movement-left-small', 'button-movement-down-small', 'button-movement-up-small', 'button-movement-right-small', 'button-clan-update-update']},
            { button: ['button-clan-update-membercount']}
        ],

        load: function(interaction)
        {                                
            const { client: { clanManagement: { clan, cache }}, member} = interaction
            
            const activeClan = clan[cache.active.get(member.id)]
            
            const embed = new EmbedBuilder().setColor(0xED8223).setTitle(`${Text.set(`Colred Plays Cluster: ${activeClan.clan}`).center(56, '⠀')}`).addFields
            (
                { name: ' ', value: template.management.member(interaction),        inline: true    },
                { name: ' ', value: template.management.tag(interaction),           inline: true    },
                { name: ' ', value: template.management.level(interaction),         inline: true    },
                { name: ' ', value: template.management.leadership(interaction),    inline: false   },
                { name: ' ', value: template.management.clanboss(interaction),      inline: true    },
                { name: ' ', value: template.management.hydra(interaction),         inline: true    },
                { name: ' ', value: template.management.chimera(interaction),       inline: true    },
                { name: ' ', value: template.management.cvc(interaction),           inline: true    },
                { name: ' ', value: template.management.siege(interaction),         inline: true    },
                { name: ' ', value: template.management.settings(interaction),      inline: true    },
                { name: ' ', value: template.management.customMessage(interaction), inline: false   },
                { name: ' ', value: template.management.applications(interaction),  inline: true    },
                { name: ' ', value: template.management.transfers(interaction),     inline: true    },
   
            ).setFooter({ text: 'Clan Statistics: 1. Clearing | Recruiting: 2. keys 3. difficulty 4. custom message' })

            return embed;
        },

        execute: function() {}
    }),

    'clan-info': Schema.embed
    ({
        meta: 
        {
            id: 'embed-clan-info'
        },

        row: 
        [
            { menu: ['menu-clan-info-select'] }
        ],

        load: function(interaction)
        {                                
            const { client: { clanManagement: { clan, cache }}, member} = interaction
            
            const activeClan = clan[cache.active.get(member.id)]
            
            if (activeClan)
            {
                const embed = new EmbedBuilder().setColor(0xED8223).setTitle(`${Text.set(`Colred Plays Cluster: ${activeClan.clan}`).center(56, '⠀')}`).addFields
                (
                    { name: ' ', value: template.info.member(interaction),        inline: true    },
                    { name: ' ', value: template.info.tag(interaction),           inline: true    },
                    { name: ' ', value: template.info.level(interaction),         inline: true    },
                    { name: ' ', value: template.info.leadership(interaction),    inline: false   },
                    { name: ' ', value: template.info.clanboss(interaction),      inline: true    },
                    { name: ' ', value: template.info.hydra(interaction),         inline: true    },
                    { name: ' ', value: template.info.chimera(interaction),       inline: true    },
                    { name: ' ', value: template.info.cvc(interaction),           inline: true    },
                    { name: ' ', value: template.info.siege(interaction),         inline: true    },
                    { name: ' ', value: template.info.customMessage(interaction), inline: false   },
                
                )
                return embed;
            }
            else
            {
                const embed = new EmbedBuilder().setColor(0xED8223).setTitle(`${Text.set(`Colred Plays Cluster: `).center(56, '⠀')}`).addFields
                (
                    { name: ' ', value: `${Text.set('Select a clan below:').constrain(56, {style: ['block_code'], align: 'center'})}`    },                
                )
                return embed;
            }
        },

        execute: function() {}
    }),

}


export { flag }
export default data






