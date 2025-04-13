import indicator            from "../mapping/indicator.json"                        with { type: 'json'}
import Shards               from "../mercy/shards.json"                             with { type: 'json'}
import config               from '../../../configuration/secret/credentials.json'   with { type: 'json' }
import { Text, Timestamp }  from "../../../utility/index.js";



const template = 
{
    greeting:
    {
        welcome: (interaction) =>
        {
            const message = 
`
${Text.set(`Welcome to the Mercy Tracker ${interaction.member.user.username}!`).constrain(58, { align: 'center', style: ['block_code']})}${Text.set(`A default 'Main' account has been created for you`).constrain(58, { align: 'center', style: ['block_code']})}
`
            return message;
        },

        rightbreakdown: () =>
        {
            const message =
` 
⠀

⠀
Use \`account_name\` in commands to specify an added alt account.
`
            return message
    },

    leftbreakdown: () =>
        {
            const message =
` 
⠀

⠀
Mercy commands use your designated **'Main'** account by default
`
            return message
    },

        options: () =>
        {
            const message = 
`
${Text.set('Manage and personalize your account!').constrain(58, { align: 'center', style: ['block_code']})}
Use ${Text.set('/account').style(['code'])} to add additional accounts, change or rename your new **'Main'** account - and access all of the settings to customize your mercy tracking.

`
            return message

        },

        signoff: () =>
        {
            const message = 
`
⠀
For a full list of commands, check out <#1197726332604383232>.
`
            return message;
        }
    },

    pull: (member, count, shard) => `<@${member.id}> pulled ${count} ${Shards.emoji[shard]}'s`,

    reset: (member, { shard, rarity, total, champion }, chance) => `
    <@${member.id}> pulled the ${rarity} ${Text.set(champion).style(['bold'])}!
    
> (${Text.set(total).ordinal(total)} ${Shards.emoji[shard]} | ${chance}% chance)
    `,

    success: (member, initial, shard, rarity, count, successChance) =>
        `**<@${member.id}>**, you've pulled a total of **${initial}** ${Shards.emoji[shard]} shards.\n\n` +
        `Your chance of pulling a **${rarity}** from **${count}** ${shard} shards is **${successChance.toFixed(2)}%**.`,

    accountLanding: (account) =>
{
    return `
${Text.set(`${indicator.color.green[account.main]} ${Text.set(account.account).constrain(12, {paddingChar: '⠀'  })}`).constrain(17, { style: ['block_code']})}
> ${Shards.emoji.ancient} ${account.mercy.ancient.legendary.total}
> ${Shards.emoji.void   } ${account.mercy.void.legendary.total}
> ${Shards.emoji.primal } ${account.mercy.primal.mythical.total}
> ${Shards.emoji.sacred } ${account.mercy.sacred.legendary.total}

${Text.set(`Last Active ${Timestamp.monthDay(account.lastActive)}`).constrain(21, {align: 'center'}).style(['code'])}` 
}
};


export { template }