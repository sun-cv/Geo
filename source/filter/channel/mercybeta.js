import { Schema, Toolkit }   from "../../../utility/index.js";



const filter = Schema.filter
({
        
    meta: 
    {
        id:             'mercy beta',
        type:           'filter',
        category:       'channel',
        description:    'Mercy Beta channel auto delete. Filters out bot messages after 15 mins'
    },

    condition:
    {
        scopes:         ['channel'],
        include:
        {
            member:     [],
            content:    [],
            channel:    ['mercy-beta'],
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
        if (message.author.bot)
        {
            return true
        }
    },

    execute:    async function(message) 
    {
        if (message.author.bot)
        {
            await Toolkit.delay((1 * 1000 ))
            message.delete()
        }
    }
})


export default filter