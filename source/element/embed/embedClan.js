import { EmbedBuilder }                             from '@discordjs/builders';
import { Embed, Input, Schema, Text, Timestamp }    from '../../../utility/index.js';
import message                                      from '../../command/mercy/system/message.js';
import indicator                                    from '../../../source/data/mapping/indicator.json'                 with { type: 'json'};


const data = 
{
    'clan-home': Schema.embed
    ({
        meta: 
        {
            id: 'embed-clan-home'
        },

        row:
        [
            {
                button:     ['button-application-apply', 'button-application-transfer']
            },
        ],

        load: function(interaction)
        {
            const { clanCluster: { clan } } = interaction.client;
            const clans = Object.values(clan).sort((a, b) => a.tier - b.tier);
            
            let count = 0
            
            const embed = new EmbedBuilder().setColor(0xED8223).setTitle(`${Text.set('Colred Plays: Raid: Shadow Legends Cluster').center(58, '⠀')}`)


            for (const entry of clans)
            {
                if (count % 1 == 0)
                {
                    Embed.set(embed).buffer(1, 1, false)
                }
                embed.addFields({ name: ' ', value: message.clan.homeLayout(entry), inline: true})

                count++;
            }

            return embed;
        },

        execute: function() {}
    }),
}

export default data