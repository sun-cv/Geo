import fs                       from 'node:fs';
import path                     from 'node:path';
import directory                from '#env/directory/path.json' with { type: 'json'}
import { MessageFlags }         from 'discord.js';
import { log, Schema, Toolkit } from "#utils";
import { Promocode }            from '#commands/promocode/system/promocode.js';



const filter = Schema.filter
({
        
    meta: 
    {
        id:             'promocode report',
        type:           'filter',
        category:       'channel',
        description:    'Promocode channel reporting system. Auto-deletes other messages'
    },

    condition:
    {
        scopes:         ['channel', 'content'],
        include:
        {
            member:     [],
            content:    ['!report'],
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
        const promocodes = message.client.promocode

        const code = message.content.split(' ', 2)[1].toLowerCase()

        if (!promocodes.validateExists(code))
        {
            log.debug(`Attempted code report failed (not found): ${code}`)
            return;
        }

        promocodes.report(code, message.author)
    }
})


export default filter