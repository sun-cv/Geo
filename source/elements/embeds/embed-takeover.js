import { EmbedBuilder }                 from '@discordjs/builders';
import { Embed, Flags, Schema, Text }   from '#utils';
import { template }                     from '#resources/templates/template-takeover.js';
import { channel }                      from '#commands/moderator/takeover.js'

const flag = Flags.from({ autoload: true })

const data = 
{

    'takeover-landing': Schema.embed
    ({
        meta: 
        {
            id: "embed-takeover-landing"
        },
        row:
        [
            { button: ['button-takeover-request'] },
        ],

        load: function(interaction)
        {
            let values = { pending: 0, accepted: 0, completed: 0};

            if (interaction.isButton())
            {   
                values = FindFieldCount(interaction, channel.landing);

                if (interaction.data.meta.id == 'button-takeover-request')
                {
                    values.pending++
                }
                if (interaction.data.meta.id == 'button-takeover-accept' && values.pending != 0)
                {
                    values.pending--
                    values.accepted++;
                }
                if (interaction.data.meta.id == 'button-takeover-decline' && values.pending != 0)
                {
                    values.pending--
                }
                if (interaction.data.meta.id == 'button-takeover-complete' && values.accepted != 0)
                {
                    values.accepted--
                    values.completed++
                }
            }
            const embed = new EmbedBuilder().setColor(0xED8223).addFields
            (
                { name: ' ', value: template.landing.landing(interaction), inline: false },
                { name: ' ', value: template.landing.message(interaction), inline: false },
                { name: ' ', value: template.landing.queue(interaction), inline: false },
                { name: ' ', value: template.landing.pending(interaction, values),  inline: true },
                { name: ' ', value: template.landing.accepted(interaction, values),  inline: true },
                { name: ' ', value: template.landing.completed(interaction, values),  inline: true },
            )

            return embed;
        },

        execute: function() {}
    }),


    'takeover-moderator': Schema.embed
    ({
        meta: 
        {
            id: 'embed-takeover-moderator'
        },

        row:
        [
            { menu: ['menu-takeover-select'] },
            { button: ['button-takeover-accept', 'button-takeover-decline', 'button-takeover-complete', 'button-takeover-refresh'] },
        ],

        load: function(interaction)
        {
            const { takeover } = interaction.client.registry.filter;
            let values         = { pending: [], accepted: [], declined: [], completed: []};

            if (interaction.isButton())
            {   
                values = FindFieldIds(interaction, channel.moderator);

                if (interaction.data.meta.id == 'button-takeover-request')
                {
                    values.pending.push(interaction.user.id);
                }

                if (interaction.data.meta.id == 'button-takeover-accept' && takeover[interaction.user.id] != null && values.pending.length > 0)
                {
                    moveUser(values, takeover[interaction.user.id], 'pending', 'accepted')
                }

                if (interaction.data.meta.id == 'button-takeover-decline' && takeover[interaction.user.id] != null && values.pending.length > 0)
                {
                    moveUser(values, takeover[interaction.user.id], 'pending', 'declined')
                }

                if (interaction.data.meta.id == 'button-takeover-complete' && takeover[interaction.user.id] != null && values.accepted.length > 0)
                {
                    moveUser(values, takeover[interaction.user.id], 'accepted', 'completed')

                    if (values.completed.length > 5)
                    {
                        values.completed.shift();
                    }
                }

                takeover[interaction.user.id] = null;
            }

            const embed = new EmbedBuilder().setColor(0xED8223).addFields
            (
                { name: ' ', value: template.moderator.landing(interaction),    inline: false },
                { name: ' ', value: template.moderator.pending(interaction, values),    inline: true },
                { name: ' ', value: template.moderator.accepted(interaction, values),   inline: true },
                { name: ' ', value: template.moderator.completed(interaction, values),  inline: true },
            )

            return embed;
        },


        execute: function() {}
    }),
}

    function FindFieldCount(interaction, channel)
    {
        const { client: { registry: { channels }}} = interaction;

        const channelid = channels.get(channel);
        const message   = channelid.messages.cache.first()

        const result  = { pending: 0, accepted: 0, completed: 0};

        message.embeds[0].fields.forEach(field => {
            const raw = field.value.replace(/```/g, "").trim(); // "Pending: 0" or "Accepted: 5"
            const match = raw.match(/(Pending|Accepted|Completed):\s*(\d+)/i);
            if (match) {
                const key = match[1].toLowerCase();   // 'pending', 'accepted', 'completed'
                const value = parseInt(match[2], 10); // 0, 5, etc
                result[key] = value;
            }
        });

        return result;
    }

    function FindFieldIds(interaction, channel) {
        const { client: { registry: { channels } } } = interaction;

        const channelObj    = channels.get(channel);
        const message       = channelObj.messages.cache.first();

        const result = { pending: [], accepted: [], declined: [], completed: [] };

        if (!message || !message.embeds[0] || !message.embeds[0].fields) return result;

        message.embeds[0].fields.forEach(field => 
        {
            const raw = field.value.replace(/```/g, "").trim();

            const matchKey = raw.match(/^(Pending|Accepted|Completed)/i);
            if (!matchKey) return;
            const key = matchKey[1].toLowerCase();

            const ids = [...raw.matchAll(/<@!?(\d+)>/g)].map(m => m[1]);
            result[key] = ids;
        });

        return result;
    }


    function moveUser(result, user, from, to) 
    {
        if (result[from].length === 0) return;
        result[from] = result[from].filter(id => id != user);
        result[to].push(user);
    }



export { flag }
export default data