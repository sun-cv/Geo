

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

const welcome = { message: (id)=> `
Welcome to the mercy tracker <@${id}>!

A default "main" account has been created for you. You can rename it anytime using /accounts.
For a full list of all commands, check out <#1197726332604383232>.
        
If you have any questions, feel free to reach out!
⎯ <@${config.admin}>
`}

export { mercyDataSets, shardTypes, welcome}