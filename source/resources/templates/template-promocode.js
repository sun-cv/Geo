import fs           from 'node:fs';
import path         from 'node:path';
import directory    from '#env/directory/path.json' with { type: 'json'}
import { Text, Timestamp }     from '#utils/index.js'
import global       from '#env/constant/global.json' with { type: 'json'}


const rewardOrder = ['champion', 'silver', 'experience_brew', 'energy_refill', 'multi_battle',
    'experience_day', 'potion', 'chicken', 'book', 'shard', 'artifact',
    'energy_flat', 'refill_arena', 'not_listed'
];


const template = 
{
        description:    (interaction) => 
        {
            const message =
`
Promo codes grant **free one-time rewards** for your account! 

Codes are **one-time use**, meaning each account can claim a reward **only once** per code. Additionally, you can **only redeem one promo code per day**, so choose wisely!

There are two main types:

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

To use a promo code:
1. Open **Raid Shadow Legends**.
2. Click on the **Menu** (left-hand side).
3. Select **Promo Codes**.
4. Enter the code and confirm.
5. Rewards will be sent to your **mailbox**, where they must be claimed before they expire (usually within 7 days).

Code e.g.
> \`date added\` \`[reported]\` : **CODE** - Rewards;
`
            return message;
        },

        player:         (interaction) => 
        {
            const filePath                          = path.join(directory.root, 'source', 'resources', 'data', 'promocodes.json');
            const codes                             = JSON.parse(fs.readFileSync(filePath, 'utf8'));

            let codeList = ''

            for (const code in codes) 
            {
                if (codes[code].type !== 'player') 
                {
                    continue;
                }
            
                const codeString = [];
            
                
                for (const key of rewardOrder)
                {
                    if (codes[code][key] !== undefined)
                    {
                        codeString.push(stringGeneration[key](codes[code]));
                    }
                }
            
                codeList += `> ${stringGeneration.date(codes[code])}${stringGeneration.reported(codes[code])} : ${stringGeneration.code(codes[code])}`;
                codeList += codeString.join(', ') + '\n';
            }


            if (codeList == '')
            {
                codeList += '> No known codes!'
            }
        
            const message = 
`
${Text.set(`New Player Codes:`).constrain(58, { style: ['block_code'], align: 'center'})}
${codeList}
`            
            return message
        },

        limited:        (interaction) => 
        {
            const filePath                          = path.join(directory.root, 'source', 'resources', 'data', 'promocodes.json');
            const codes                             = JSON.parse(fs.readFileSync(filePath, 'utf8'));

            let codeList = ''

            for (const code in codes) 
            {
                if (codes[code].type !== 'limited') 
                {
                    continue;
                }
            
                const codeString = [];
            
                
                for (const key of rewardOrder)
                {
                    if (codes[code][key] !== undefined)
                    {
                        codeString.push(stringGeneration[key](codes[code]));
                    }
                }
            
                codeList += `> ${stringGeneration.date(codes[code])}${stringGeneration.reported(codes[code])} : ${stringGeneration.code(codes[code])}`;
                codeList += codeString.join(', ') + '\n';
            }

            if (codeList == '')
            {
                codeList += '> No known codes!'
            }
        
            const message = 
`
${Text.set(`Time-Limited codes:`).constrain(58, { style: ['block_code'], align: 'center'})}
${codeList}
`            
            return message
        },

        closing: (interaction) =>
        {
            const message =
`


If a promo code is reported as no longer functioning it will be marked with an [x]. After several confirmed reports it will be removed.

If you find a promo code that has expired or a new one to be added to the list please ping <@${global.admin}>

Thank you!
`
            return message;
        }
};


export { template }



const stringGeneration = 
{

    date: (input) =>
    {
        return `${Text.set(`${Timestamp.monthDay(input.timestamp)}`).constrain(5, {style: ['code']})} `
    },

    reported: (input) =>
    {
        return `${Text.set(`[${input.reported == true ? 'x' : ' '}]`).constrain(3, {style: ['code']})} `
    },

    code: (input) => 
    {
        return `${Text.set(`${input.code.toUpperCase()} -`).style(['bold'])} `;
    },

    silver: (input) => 
    {
        return `${input.silver} Silver`;
    },

    experience_brew: (input) => 
    {
        return `${input.experience_brew} Brews`;
    },

    energy_refill: (input) => 
    {
        return `${input.energy_refill} Energy Refills`;
    },

    multi_battle: (input) => 
    {
        return `${input.multi_battle} Multi-Battles`;
    },

    experience_day: (input) => 
    {
        return `${input.experience_day} Days XP Boost`;
    },

    potion: (input) => 
    {
        return `${input.potion} Potions`;
    },

    chicken: (input) => 
    {
        return `${input.chicken} Chickens`;
    },
    book: (input) => 
    {
        return `${input.book} Skill Tomes`;
    },

    champion: (input) => 
    {
        return `Receive ${input.champion}`;
    },

    shard: (input) => 
    {
        return `${input.shard} Shards`;
    },

    artifact: (input) => 
    {
        return `${input.artifact} Artifacts`;
    },

    energy_flat: (input) => 
    {
        return `${input.energy_flat} Energy`;
    },

    refill_arena: (input) => 
    {
        return `${input.refill_arena} Arena Refills`;
    },

    not_listed: (input) => 
    {
        return `${input.not_listed}`;
    },
}