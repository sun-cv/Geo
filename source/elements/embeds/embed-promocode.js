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
                { name: ' ', value: template.closingHeader(interaction),inline: false },
                { name: ' ', value: ' ',                                inline: false },
                { name: ' ', value: template.found(interaction),        inline: true  },
                { name: ' ', value: template.discovered(interaction),   inline: true  },
                { name: ' ', value: ' ',                                inline: false },
                { name: ' ', value: template.closing(interaction),      inline: false },
                { name: ' ', value: template.example(interaction),      inline: true  },
                { name: ' ', value: template.report(interaction),       inline: true  },

            )

            return embed;
        },

        execute: function() {}
    }),


    'promo-announcement': Schema.embed
    ({
        meta: 
        {
            id: "embed-promo-announcement"
        },


        load: function(interaction)
        {
            const promocode = interaction.client.promocode
            const data      = promocode.data

            const embed = new EmbedBuilder().setColor(0xED8223).addFields
            (
                { name: ' ', value: template.announcement.header(data),                 inline: false },
                { name: ' ', value: ' ',                                inline: false },
                { name: ' ', value: template.announcement.revamp(promocode.channel, promocode.role),    inline: false },
                { name: ' ', value: ' ',                                inline: false },
                { name: ' ', value: template.announcement.category(),                   inline: true  },
                { name: ' ', value: template.announcement.status(),                     inline: true  },
                { name: ' ', value: template.announcement.report(),                     inline: true  },
                { name: ' ', value: ' ',                                inline: false },
                { name: ' ', value: template.announcement.close(promocode.channel),     inline: true  },
            )

            return embed;
        },

        execute: function() {}
    }),
}

export { flag }
export default data