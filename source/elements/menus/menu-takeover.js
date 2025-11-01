import { Component, EmbedManager, navigate, Schema, Text, Input, Flags }    from '#utils';
import { channel }                      from '#commands/moderator/takeover.js'


const flag = Flags.from({ autoload: true })

const data = 
{
    'takeover-select': Schema.menu
    ({
        meta: { id: 'menu-takeover-select' },
    
        flag:
        {
            navigation: true,
        },
        
        load: function(interaction)
        {
            const { client, client: { registry: { channels, guild }}} = interaction;
                
            let channelid = channels.get(channel.moderator);
            const message = channelid.messages.cache.first()

            const values = FindFieldIds(interaction, channel.moderator);
            const sorted = [...values.pending, ...values.accepted];
            const users  = {};

            sorted.forEach(user => {
                const name  = guild.members.cache.get(user).nickname
                users[name] = user;
            })

            return Component
                .menu(this.meta.id)
                .placeholder('Select user to manage')
                .values(1, 1)
                .objectOptions(users)
        },
    
        execute: function(interaction) 
        {
            const { takeover }      = interaction.client.registry.filter
            const [ user ]          = Input.menu(interaction);

            takeover[interaction.user.id] = user;
        }
    })
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


export { flag }
export default data;