import fs                   from 'node:fs';
import path                 from 'node:path';
import directory            from '#env/directory/path.json' with { type: 'json'}
import { Text, Timestamp }  from '#utils/index.js'
import global               from '#env/constant/global.json' with { type: 'json'}

import indicator            from '#resources/mapping/indicator.json' with { type: 'json'}

const order = ['champion', 'silver', 'experience_brew', 'energy_refill', 'multi_battle',
    'experience_day', 'potion', 'chicken', 'book', 'shard', 'artifact',
    'energy_flat', 'refill_arena', 'not_listed'];


const template = 
{
        description:    (interaction) => 
        {
            const message =
`
${Text.set(`Raid Shadow Legends Promo codes`).constrain(58, { style: ['block_code'], align: 'center'})}
Promo codes grant **free one-time rewards** for your account! 

Codes are **one-time use**, meaning each account can claim a reward **only once** per code. Additionally, you can **only redeem one promo code per day**, so choose wisely!

${Text.set(`Types of promo codes:`).constrain(58, { style: ['block_code'], align: 'center'})}

`

            return message;
        },

        newPlayer: (interaction) =>
        {
            const message =
`
- **New Player Codes**
> Designed for brand-new accounts, these codes can be redeemed early in the game, before reaching a certain level or number of days played.
`
            return message
        },

        timeLimited: (interaction) =>
        {
            const message =
`
- **Time-Limited Codes**
> These codes have a specific **start and end date**, after which they expire and can no longer be redeemed.
`
            return message
        },

        details: (interaction) =>
        {
            const message =
`

${Text.set(`Using a code:`).constrain(58, { style: ['block_code'], align: 'center'})}
1. Open **Raid Shadow Legends**.
2. Click on the **Menu** (left-hand side).
3. Select **Promo Codes**.
4. Enter the code and confirm.
5. Rewards will be sent to your **mailbox**, where they must be claimed before they expire (usually within 7 days).

`
            return message;
        },

        player: (interaction) => 
        {
            const promocode  = interaction.client.promocode
            const promocodes = promocode.player;
            const validCodes = promocodes.filter(code => code.flag.valid.get());
                
            const codeList = validCodes.length
                ? validCodes.map(code => promocode.formatCode(code)).join('\n')
                : '> No Active codes';
        
            const message = 
`
${Text.set(`New Player Codes:`).constrain(58, { style: ['block_code'], align: 'center'})}
${codeList}
`
            return message;
        },



        limited: (interaction) => 
        {
            const promocode  = interaction.client.promocode
            const promocodes = promocode.limited;
            const validCodes = promocodes.filter(code => code.flag.valid.get());

            const codeList = validCodes.length
                ? validCodes.map(code => promocode.formatCode(code)).join('\n')
                : '> No Active codes';
        
            const message = 
`
${Text.set(`Limited-time Codes:`).constrain(58, { style: ['block_code'], align: 'center'})}
${codeList}
`
            return message;
        },

        example: (interaction) =>
        {
            const message =
        `
code e.g.
> \`status\` **CODE** - Promo items;
        `
            return message;
        },

        report: (interaction) =>
        {
            const message =
`
Report e.g.
> !report TRIVIADUNGEON
`
            return message;
        },

        found: () =>
        {
            const message =
`
*Code doesn't work?*
> Use **!report CODE** to report it!
`
            return message
        },
        discovered: () =>
        {
            const message =
`
*Discovered new promo code?*
> Ping <@${global.admin}> and it'll get added!
`
            return message
        },

        closingHeader: (interaction) =>
        {
            const message =
`
${Text.set(`New Promos, reporting, details:`).constrain(58, { style: ['block_code'], align: 'center'})}
**Don't forget to sign up for promo code notifications at <id:customize>!!**
`
            return message;
        },

        closing: (interaction) =>
        {
            const message =
`
Promo code status is tracked using the indicators below:

\`🟢\` = Verified working
\`🟠\` = Reported, under review
\`🔴\` = Marked invalid, pending removal

When a code is first reported, it will be flagged as under review. If multiple users report to confirm it's no longer working, it will escalate to invalid. After 5 reports, the code is automatically removed from the list.
`
            return message;
        },

        announcement:
        {
            header: (data) =>
            {
                const message =
`
${Text.set(`🎉 A new Promo Code just dropped!`).constrain(58, {style: ['block_code'], align: 'center'})}
${data.formattedCode}

`
                return message
            },

            revamp: (channel, role) =>
            {
                const message =
`
But that’s not all <@&${role.id}> — we’ve revamped the entire promo-codes page to make it easier than ever to stay up to date!

`
                return message
            },

            category: (channel) =>
            {
                const message =
`
${Text.set(`Categories:`).constrain(18, {style: ['block_code'], align: 'center'})}
Clear categories for New Player and Limited-Time codes
`
                return message
            },            
            
            status: (channel) =>
            {
                const message =
`
${Text.set(`Status:`).constrain(18, {style: ['block_code'], align: 'center'})}
Live status tracking — see which codes are 
\`🟢\` = Verified working
\`🟠\` = Reported
\`🔴\` = Marked invalid
`
                return message
            },            
            
            report: (channel) =>
            {
                const message =
`
${Text.set(`Report:`).constrain(18, {style: ['block_code'], align: 'center'})}
 Report broken codes instantly with 
 
 *!report CODE*
`
                return message
            },
            close: (channel, role) =>
            {
                const message =
`
Head over to <#${channel.id}> now to check it out and claim some freebies while they’re still active!
`
                return message
            },


        }



};


export { template }
