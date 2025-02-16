import config from '../../../../environment/config.json'    with { type: 'json'};
import Shards from '../tracker/shards.json'                 with { type: 'json'};


const welcome =  (id) => 
{`
Welcome to the mercy tracker <@${id}>!

A default "main" account has been created for you. You can rename it anytime using /accounts.
For a full list of all commands, check out <#1197726332604383232>.
        
If you have any questions, feel free to reach out!
⎯ <@${config.admin}>
`}


const pull = (member, count, shard) =>
{`
<@${member.id}> pulled ${count} ${Shards.configuration[shard].emoji}'s
`}

const error = 
{
    account: 
    {
        notFound: (name) => `Account '${name}' was not found.`,
    }

}


export { welcome, pull };