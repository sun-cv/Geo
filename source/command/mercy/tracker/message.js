import config           from '../../../../configuration/secret/credentials.json'    with { type: 'json'};
import Shards           from '../../../../source/data/mercy/shards.json'            with { type: 'json'};
import indicator        from '../../../data/mapping/indicator.json'                 with { type: 'json'};
import { Text }         from '../../../../utility/index.js';
import { Timestamp }    from '../../../../utility/index.js';


const welcome = (id) => 
{
    return `
## Welcome to the Mercy Tracker, <@${id}>!

A default **'Main'** account has been created for you.  

Unless you specify otherwise, all Mercy Tracker commands will apply to your designated **'Main'** account by default.

Feel free to create new accounts, rename your new **'Main'** account, update your settings, or switch your default **'Main'** account anytime using: ${Text.set('/accounts').style(['code'])}

For a full list of commands, check out <#1197726332604383232>.

If you have any questions, don't hesitate to reach out!
    ⎯ <@${config.admin}>
    `;
}

const pull = (member, count, shard) => 
{
    return `
<@${member.id}> pulled ${count} ${Shards.emoji[shard]}'s
    `;
}

const reset = (member, {shard, rarity, total, champion}, chance) =>
{
    return `
    <@${member.id}> pulled the ${rarity} ${Text.set(champion).style(['bold'])}!
    
> (${Text.set(total).ordinal(total)} ${Shards.emoji[shard]} | ${chance}% chance)
    `;
}

const success = (member, initial, shard, rarity, count, successChance) => {
    return `**<@${member.id}>**, you've pulled a total of **${initial}** ${Shards.emoji[shard]} shards.\n\n` + 
    `Your chance of pulling a **${rarity}** from **${count}** ${shard} shards is **${successChance.toFixed(2)}%**.`
}


const accountLandingMercy = (account) =>
{
    return `
${Text.set(`${indicator.color.green[account.main]} ${Text.set(account.account).constrain(12, {paddingChar: '⠀'  })}`).constrain(17, { style: ['block_code']})}
> ${Shards.emoji.ancient} ${account.mercy.ancient.legendary.total}
> ${Shards.emoji.void} ${account.mercy.void.legendary.total}
> ${Shards.emoji.primal} ${account.mercy.primal.mythical.total}
> ${Shards.emoji.sacred} ${account.mercy.sacred.legendary.total}

${Text.set(`Last Active ${Timestamp.monthDay(account.lastActive)}`).constrain(21, {align: 'center'}).style(['code'])}` 
}
    
    

const error = 
{
    account: 
    {
        notFound: (name) => 
        {
            return `Account '${name}' was not found.`;
        },
    }
}

export default { welcome, pull, reset, success, error, accountLandingMercy, flag: { ignore: true } };
