import { Schema, Toolkit }   from "#utils";


const filter = Schema.filter
({
        
    meta: 
    {
        id:             'sweeper',
        type:           'filter',
        category:       'channel',
        description:    'Channel sweeper - any channel on list will automatically delete new messages.'
    },

    condition:
    {
        scopes:         ['channel'],
        include:
        {
            member:     [],
            content:    [],
            channel:    ['promo-codes'],
        },
        exclude:
        {
            member:     [],
            content:    [],
            channel:    [],        
        }
    },

    flag:
    {
        bot: true,
    },

    evaluate:   function(message) 
    {
        return this.condition.check(message);

    },

    execute:    async function(message) 
    {
        if (!message.author.bot)
        {
            await Toolkit.delay((1 * 1000 * 5))
            message.delete()
        }
    }
})


export default filter