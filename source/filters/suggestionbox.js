import { Schema, Toolkit }  from '#utils';
import Shards               from '#resources/env/shards.json'  with { type: 'json' };


const filter = Schema.filter
({
        
    meta: 
    {
        id:             'suggestion box',
        type:           'filter',
        category:       'community',
        description:    'Community suggestion box filter. Filters out non-tagged messages and emotes for funsies.'
    },

    condition:
    {
        scopes:         ['channel'],
        include:
        {
            member:     [],
            content:    [],
            channel:    ['suggestion-box'],
        },
        exclude:
        {
            member:     [],
            content:    [],
            channel:    [],        
        }
    },


    evaluate:   function(message) 
    {
        return this.condition.check(message);
    },

    execute:    async function(message) 
    {
		const validTags = ['video', 'community', 'feedback', 'discord', 'other'];
		const emojis    = Object.values(Shards.emoji)

        const mentionedTags = message.mentions.roles;
        const hasValidTag   = mentionedTags.some((role) => validTags.includes(role.name.toLowerCase()));

        if (!hasValidTag)
        {
            await message.guild.roles.fetch()
            const tagMentions = validTags.map(name => message.guild.roles.cache.find(role => role.name.toLowerCase() === name.toLowerCase())).filter(Boolean).map(role => `<@&${role.id}>`);
            
            const warning = await message.reply(`Please start your message with a tag corresponding to your suggestion:`);

            for (const tag of tagMentions) 
            {
                await Toolkit.delay(1500);
                await warning.edit(`Please start your message with a tag corresponding to your suggestion: ${tag}`);
            }
            await warning.delete()
            await message.delete();

            return;
        }
        
        // await message.react('<:keanu_thanks59:1185010015178870894>');

        for (let i = 0; i < 3; i++) 
        {
            const emoji = emojis[Math.floor(Math.random() * emojis.length)];
            message.react(emoji);
        }

    }

})





export default filter