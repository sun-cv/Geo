import fs                               from 'fs';
import path                             from 'path';
import directory                        from '#env/directory/path.json' with { type: 'json'}
import { EmbedBuilder }                 from '@discordjs/builders';
import { Embed, Flags, Schema, Text }   from '#utils';
import { template }                     from '#resources/templates/template-promocode.js';


const flag = Flags.from({ autoload: true })

const data = 
{

    'promo-landing': Schema.embed
    ({
        meta: 
        {
            id: "embed-promo-landing"
        },


        load: function(interaction)
        {
            const embed = new EmbedBuilder().setColor(0xED8223).addFields
            (
                { name: ' ', value: template.description(interaction),  inline: false },
                { name: ' ', value: ' ',                                inline: false },
                { name: ' ', value: template.newPlayer(interaction),    inline: true  },
                { name: ' ', value: template.timeLimited(interaction),  inline: true  },
                { name: ' ', value: ' ',                                inline: false },
                { name: ' ', value: template.details(interaction),      inline: false },
                { name: ' ', value: template.player(interaction),       inline: false },
                { name: ' ', value: template.limited(interaction),      inline: false },
                { name: ' ', value: ' ',                                inline: false },
                { name: ' ', value: template.closing(interaction),      inline: false }
            )

            return embed;
        },

        execute: function() {}
    }),
}


export { flag }
export default data