import config from '../../../../configuration/secret/credentials.json' with { type: 'json' };
import Shards from '../../../../source/data/mercy/shards.json' with { type: 'json' };
import indicator from '../../../data/mapping/indicator.json' with { type: 'json' };
import { Text, Timestamp } from '../../../../utility/index.js';
import { applicationData } from '../../../data/application/data.js';

const mercy = 
{
    welcome: (id) => `
## Welcome to the Mercy Tracker, <@${id}>!

A default **'Main'** account has been created for you.  

Unless you specify otherwise, all Mercy Tracker commands will apply to your designated **'Main'** account by default.

Feel free to create new accounts, rename your new **'Main'** account, update your settings, or switch your default **'Main'** account anytime using: ${Text.set('/accounts').style(['code'])}

For a full list of commands, check out <#1197726332604383232>.

If you have any questions, don't hesitate to reach out!
    ⎯ <@${config.admin}>
    `,

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



const clan = 
{
    homeLayout: (clan) => {
        const { leadership, recruitment: { clanBoss, hydra, chimera, cvc, siege } } = clan;
        const leadershipMap = Object.values(leadership).flat().map((member) => member ? `<@${member}>` : '').slice(0, 3);

        return `
${Text.set(`${indicator.color.green[clan.member.count < 30]} ${clan.member.count}/30  |  ${Text.set(clan.clan).constrain(36)} ${clan.recruitment.clanTag ? '[CPR]' : ''}`).constrain(58, { style: ['block_code'] })}:
> ${Text.set(`Demon  : ${clanBoss.custom || `${clanBoss.keys} key ${clanBoss.difficulty}`}`).constrain(32, { style: ['code'] })} ${Text.set(`Siege  : ${siege.custom || (siege.required ? 'required' : 'optional')}`).constrain(32, { style: ['code'] })}
> ${Text.set(`Hydra  : ${hydra.custom || `${hydra.keys} key ${hydra.difficulty}`}`).constrain(32, { style: ['code'] })} ${Text.set(`CVC    : ${cvc.custom || `${cvc.points}k minimum`}`).constrain(32, { style: ['code'] })}
> ${Text.set(`Chimera: ${chimera.custom || `${chimera.keys} key ${chimera.difficulty}`}`).constrain(32, { style: ['code'] })}
:
> ${leadershipMap.length > 1 ? leadershipMap : 'TBD'}
`;
    },
};

const application = 
{

    clan: (application) =>
    {
        const { clan, meta } = application
        const message =
        `
${Text.set(`   ${Text.set('Clan').constrain(11, { align: 'center' })}`).constrain(17, { style: ['block_code'] })}
> ${Text.set(`${Text.set(`${clan.selection}`).constrain(15)} ${meta.location == 0 ? '◀' : ' '}`).constrain(18, { style: ['code'] })}
        `
        return message;
    },

    siege: (application) =>
    {
        const { siege, meta } = application
        const message =
        `
${Text.set(`   ${Text.set('Siege').constrain(11, { align: 'center' })}`).constrain(17, { style: ['block_code'] })}
> ${Text.set(`${Text.set(`Active: ${siege.active != null ? siege.active : ' '}`).constrain(15)} ${meta.location == 1 ? '◀' : ' '}`).constrain(18, { style: ['code'] })}
        `
        return message;
    },

    cvc: (application) =>
    {
        const { cvc, meta } = application;
        const message =
`
${Text.set(`   ${Text.set('CvC').constrain(11, { align: 'center' })}`).constrain(17, { style: ['block_code'] })}
> ${Text.set(`${Text.set(`Points: ${cvc.points}`).constrain(15)} ${meta.location == 2 ? '◀' : ' '}`).constrain(18, { style: ['code'] })}

`
        return message;
    },

    question: (application) => 
    {
        const { questions } = applicationData(application);
        const message = 
`
${Text.set(`${questions[application.meta.location]}`).constrain(100, { style: ['block_code'], paddingChar: '⠀' })}
`

        return message;
    },

    clanBoss: (application) => 
    {
    const { clanboss, meta } = application;
    const message = 
`
 ${Text.set(`${clanboss.complete ? indicator.color.green[true] : indicator.color.blue.blank[[3, 4].includes(meta.location)]} ${Text.set('Clan Boss').constrain(11, { align: 'center' })}`).constrain(17, { style: ['block_code'] })}
> ${Text.set(`${Text.set(`Diff: ${clanboss.difficulty}`).constrain(15)} ${meta.location == 3 ? '◀' : ' '}`).constrain(18, { style: ['code'] })}
> ${Text.set(`${Text.set(`Keys: ${clanboss.keys}`).constrain(15)} ${meta.location == 4 ? '◀' : ' '}`).constrain(18, { style: ['code'] })}
`;

    return message;
    },

    hydra: (application) => 
    {

    const { hydra, meta } = application;
    const message =
`
${Text.set(`${hydra.complete ? indicator.color.green[true] : indicator.color.blue.blank[[5, 6].includes(meta.location)]} ${Text.set('Hydra').constrain(11, { align: 'center' })}`).constrain(17, { style: ['block_code'] })}
> ${Text.set(`${Text.set(`Diff: ${hydra.difficulty}`).constrain(15)} ${meta.location == 5 ? '◀' : ' '}`).constrain(18, { style: ['code'] })}
> ${Text.set(`${Text.set(`Dmg : ${hydra.damage}`).constrain(15)} ${meta.location == 6 ? '◀' : ' '}`).constrain(18, { style: ['code'] })}
`

    return message;
        },

    chimera: (application) => 
    {

    const { chimera, meta } = application;
    const message = 
`
${Text.set(`${chimera.complete ? indicator.color.green[true] : indicator.color.blue.blank[[7, 8].includes(meta.location)]} ${Text.set('Chimera').constrain(11, { align: 'center' })}`).constrain(17, { style: ['block_code'] })}
> ${Text.set(`${Text.set(`Diff: ${chimera.difficulty}`).constrain(15)} ${meta.location == 7 ? '◀' : ' '}`).constrain(18, { style: ['code'] })}
> ${Text.set(`${Text.set(`Dmg : ${chimera.damage}`).constrain(15)} ${meta.location == 8 ? '◀' : ' '}`).constrain(18, { style: ['code'] })}
`

    return message;
    },

};



const error = 
{
    account: {
        notFound: (name) => `Account '${name}' was not found.`,
    },
};



export default {
    mercy,
    clan,
    application,
    error,
    flag: { ignore: true },
};