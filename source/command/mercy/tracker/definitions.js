

const mercyDataSets     = ["mercy", "pull", "reset", "champion"];
const shardTypes        = 
[   
    { shard: 'ancient', rarity: 'legendary' }, 
    { shard: 'void',    rarity: 'legendary' },
    { shard: 'primal',  rarity: 'legendary' },
    { shard: 'primal',  rarity: 'mythical'  },
    { shard: 'sacred',  rarity: 'legendary' },
    { shard: 'prism',   rarity: 'legendary' }
];

const shardData         =
{
    ancient: 
    {
        rarity: ['legendary'],
        mercy: 
        {
            start: 200,
            base: 0.5,
            increase: 5,
        },
        emoji: '<:Ancient:1184573482684661950>'
    }
}

const shardEmojis = {
	'ancient': '<:Ancient:1184573482684661950>',
	'void': '<:Void:1184573509037477999>',
	'primal': '<:Primal:1184573522958364762>',
	'primal.legendary': '<:Primal:1184573522958364762>',
	'primal.mythical': '<:Primal:1184573522958364762>',
	'sacred': '<:Sacred:1184573533037273258>',
};




const welcome = { message: (id)=> `
Welcome to the mercy tracker <@${id}>!

A default "main" account has been created for you. You can rename it anytime using /accounts.
For a full list of all commands, check out <#1197726332604383232>.
        
If you have any questions, feel free to reach out!
⎯ <@${config.admin}>
`}

export { mercyDataSets, shardTypes, welcome}