import config   from '../../../../configuration/secret/credentials.json'   with { type: 'json'};
import Shards   from '../../../../source/data/mercy/shards.json'            with { type: 'json'};
import { Text } from '../../../../utility/index.js';

const welcome = (id) => 
{
    return `
## Welcome to the Mercy Tracker, <@${id}>!

A default **'main'** account has been created for you.  

If you don't specify an account when using commands, they will apply to the account set as your **'main'** account.

You can create additional accounts, rename your accounts, update your settings, or change your default **'main'** account using: ${Text.set('/accounts').style(['code'])}

For a full list of commands, check out <#1197726332604383232>.

If you have any questions, feel free to reach out!
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
    <@${member.id}> pulled the ${rarity} ${Text.set(champion).style(['bold'])} on their ${Text.set(total).ordinal(total)} ${Shards.emoji[shard]} shard! (${chance}% chance)
    `;
}

const success = (member, initial, shard, rarity, count, successChance) => {
    return `**<@${member.id}>**, you've pulled a total of **${initial}** ${Shards.emoji[shard]} shards.\n\n` + 
    `Your chance of pulling a **${rarity}** from **${count}** ${shard} shards is **${successChance.toFixed(2)}%**.`
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

export default { welcome, pull, reset, success, error, flag: { ignore: true } };
