import { Text, Timestamp }      from '#utils'
import { applicationConfig }    from '#commands/clan/config/application.js';
import indicator                from '#resources/mapping/indicator.json' with {type: 'json'}

const template = 
{

    clan: (application) =>
    {
        const { selection, meta } = application
        const message =
        `
${Text.set(`   ${Text.set('Clan').constrain(11, { align: 'center' })}`).constrain(17, { style: ['block_code'] })}
> ${Text.set(`${Text.set(`${selection.preferred}`).constrain(15)} ${meta.location == 0 ? '◀' : ' '}`).constrain(18, { style: ['code'] })}
        `
        return message;
    },

    siege: (application) =>
    {
        const map = {true: 'yes', null: 'maybe', false:'no'}

        const { siege, meta } = application
        const message =
        `
${Text.set(`   ${Text.set('Siege').constrain(11, { align: 'center' })}`).constrain(17, { style: ['block_code'] })}
> ${Text.set(`${Text.set(`Active: ${siege.active != '' ? map[siege.active] : ' '}`).constrain(15)} ${meta.location == 1 ? '◀' : ' '}`).constrain(18, { style: ['code'] })}
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
        const { questions } = applicationConfig;
        const message = 
`
${Text.set(`${questions(application)[application.meta.location]}`).constrain(100, { style: ['block_code'], paddingChar: '⠀' })}
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

    applicationCard1: (application) =>
    {

        const { account, cvc, siege} = application
        const map = {true: 'yes', null: 'maybe', false:'no'}

        const message =
`
> ${Text.set(`account: ${account} `).constrain(30, {style: ['code']})} 
> ${Text.set(`cvc    : ${cvc.points} `).constrain(30, { style: ['code'] })} 
> ${Text.set(`siege  : ${map[siege.active]} `).constrain(30, { style: ['code'] })} 
`
    return message
    },

    applicationCard2: (application) =>
    {

        const { clanboss, hydra, chimera } = application

        const message =
`
> ${Text.set(`demon  : ${clanboss.difficulty} `).constrain(30, { style: ['code'] })} 
> ${Text.set(`hydra  : ${hydra.difficulty} `).constrain(30, { style: ['code'] })} 
> ${Text.set(`chimera: ${chimera.difficulty} `).constrain(30, { style: ['code'] })} 

`
    return message

    },

    menu: (application) => 
    {
        const message = 
`
${Timestamp.monthDay(application.timestamp)} | ${Text.set(application.member).constrain(15,{ paddingChar: '⠀' })}
`
        return message;
    },


    management:
    {

    clan: (application) =>
    {
        const { selection, meta } = application
        const message =
        `
${Text.set(`   ${Text.set('Clan').constrain(11, { align: 'center' })}`).constrain(17, { style: ['block_code'] })}
> ${Text.set(`${Text.set(`${selection.preferred}`).constrain(15)} ${meta.location == 0 ? '◀' : ' '}`).constrain(18, { style: ['code'] })}
        `
        return message;
    },

    siege: (application) =>
    {
        const map = {true: 'yes', null: 'maybe', false:'no'}

        const { siege, meta } = application
        const message =
        `
${Text.set(`   ${Text.set('Siege').constrain(11, { align: 'center' })}`).constrain(17, { style: ['block_code'] })}
> ${Text.set(`${Text.set(`Active: ${siege.active != '' ? map[siege.active] : ' '}`).constrain(15)} ${meta.location == 1 ? '◀' : ' '}`).constrain(18, { style: ['code'] })}
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

    message: (application) => 
    {
        const message = 
`
${Text.set(`Select Accept or decline then submit to finalize the application. Alternatively you can reassign to an alternate or more fitting clan below. `).constrain(150, { style: ['block_code'], paddingChar: '⠀' })}
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

    applicationCard1: (application) =>
    {

        const { account, cvc, siege} = application
        const map = {true: 'yes', null: 'maybe', false:'no'}

        const message =
`
> ${Text.set(`account: ${account} `).constrain(30, {style: ['code']})} 
> ${Text.set(`cvc    : ${cvc.points} `).constrain(30, { style: ['code'] })} 
> ${Text.set(`siege  : ${map[siege.active]} `).constrain(30, { style: ['code'] })} 
`
    return message
    },

    applicationCard2: (application) =>
    {

        const { clanboss, hydra, chimera } = application

        const message =
`
> ${Text.set(`demon  : ${clanboss.difficulty} `).constrain(30, { style: ['code'] })} 
> ${Text.set(`hydra  : ${hydra.difficulty} `)   .constrain(30, { style: ['code'] })} 
> ${Text.set(`chimera: ${chimera.difficulty} `) .constrain(30, { style: ['code'] })} 

`
    return message

    },

    menu: (application) => 
    {
        const message = 
`
${Timestamp.monthDay(application.timestamp)} | ${Text.set(application.member).constrain(15,{ paddingChar: '⠀' })}
`
        return message;
    }, 
    },


    accepted: (interaction, application) =>
    {

        const clan = interaction.client.clanManagement.clan[application.clan]

        const message =
`
Welcome to the ${application.clan} home-base <@${application.id}>!

Here you can:
- Find the latest clan news in the <#${clan.channel.announcements}>
- Discuss siege in your <#${clan.channel.warroom}>
- Post your <#${clan.channel.roster}>

Say hello to your fellow clan members and have fun!
`
        return message
    }
};


export { template }