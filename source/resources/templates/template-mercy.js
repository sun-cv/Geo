import indicator                        from '#resources/mapping/indicator.json' with { type: 'json'}
import Shards                           from '#resources/env/shards.json'  with { type: 'json'}
import { MercyUtil, Text, Timestamp }   from '#utils';



const template = 
{
    greeting:
    {
        welcome: (interaction) =>
        {
            const message = 
`
${Text.set(`Welcome to the Mercy Tracker ${interaction.member.user.username}!`).constrain(58, { align: 'center', style: ['block_code']})}${Text.set(`A default 'main' account has been created for you`).constrain(58, { align: 'center', style: ['block_code']})}
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
Mercy commands use your designated **'main'** account by default
`
            return message
    },

        options: () =>
        {
            const message = 
`
${Text.set('Manage and personalize your account!').constrain(58, { align: 'center', style: ['block_code']})}
Use ${Text.set('/account').style(['code'])} to add additional accounts, change or rename your new **'main'** account - and access all of the settings to customize your mercy tracking.

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

    command:
    {


        pull: (interaction) => 
        {
            const { mercy }                         = interaction.client
            const member                            = mercy.initialize(interaction);
            const account                           = member.account.getActive()

            const last = account.session.lastPull()

            const message =
`
${member.username} pulled ${last.count} ${Shards.emoji[last.source]}'s
`
            return message;
        },

        reset: 
        {
            pull: (interaction) => 
            {
                const { mercy }                         = interaction.client
                const member                            = mercy.initialize(interaction);
                const account                           = member.account.getActive()

                const last = account.session.lastChampion()

                const message = 
`
${Text.set(`${member.username} pulled the ${last.rarity} ${last.champion}!`).constrain(60, {style: ['block_code']})}`
                return message
            },

            chance: (interaction) =>
            {

                const { mercy }                         = interaction.client
                const member                            = mercy.initialize(interaction);
                const account                           = member.account.getActive()

                const last      = account.session.lastChampion()
                const chance    = MercyUtil.calculateMercy(last.source, last.rarity, last.total)

                const message =
`
> ${Text.set(`( ${Text.set(last.total).ordinal(last.total)} ${Shards.emoji[last.source]} | ${chance} )`).constrain(70)}
`
                return message
            }
        },
        success: (member, initial, shard, rarity, count, successChance) =>
        {
            const message =
`
**<@${member.id}>**, you've pulled a total of **${initial}** ${Shards.emoji[shard]} shards

Your cumulative chance of pulling a **${rarity}** from **${count}** ${shard} shards is **${successChance.toFixed(2)}%**.
`
            return message;
        },

        log: (data) =>
        {
            const message = 
`
Successfully logged ${data.rarity} ${data.champion} from ${data.source}!
`   
            return message
    },

            mercy: (account) =>
        {
            const message =
`
    ${Text.set(`${indicator.color.green[account.main]} ${Text.set(account.name).constrain(12, {paddingChar: '⠀'  })}`).constrain(17, { style: ['block_code']})}
    > ${Shards.emoji.ancient} ${Text.set(`${Text.set(`${account.mercy.ancient.legendary.total}`).constrain(3, {paddingChar: '⠀'})} ${Text.set(`${account.mercy.ancient.legendary.mercy}`).constrain(10, { align: 'right', paddingChar: '⠀'})}`).constrain(15, {style: ['code']})}
    > ${Shards.emoji.void   } ${Text.set(`${Text.set(`${account.mercy.void.legendary.total}`).constrain(3, {paddingChar: '⠀'})} ${Text.set(`${account.mercy.ancient.legendary.mercy}`).constrain(10, { align: 'right', paddingChar: '⠀'})}`).constrain(15, {style: ['code']})}
    > ${Shards.emoji.primal } ${Text.set(`${Text.set(`${account.mercy.primal.mythical.total}`).constrain(3, {paddingChar: '⠀'})} ${Text.set(`${account.mercy.ancient.legendary.mercy}`).constrain(10, { align: 'right', paddingChar: '⠀'})}`).constrain(15, {style: ['code']})}
    > ${Shards.emoji.sacred } ${Text.set(`${Text.set(`${account.mercy.sacred.legendary.total}`).constrain(3, {paddingChar: '⠀'})} ${Text.set(`${account.mercy.ancient.legendary.mercy}`).constrain(10, { align: 'right', paddingChar: '⠀'})}`).constrain(15, {style: ['code']})}
    
    ${Text.set(`Last Active ${Timestamp.monthDay(account.lastActive)}`).constrain(21, {align: 'center'}).style(['code'])}` 
            return message
        },
    
    },
    account: 
    {
        accountLanding: (account) =>
        {
            const message =
`
    ${Text.set(`${indicator.color.green[account.main]} ${Text.set(account.name).constrain(12, {paddingChar: '⠀'  })}`).constrain(17, { style: ['block_code']})}
    > ${Shards.emoji.ancient} ${account.mercy.ancient.legendary.total}
    > ${Shards.emoji.void   } ${account.mercy.void.legendary.total}
    > ${Shards.emoji.primal } ${account.mercy.primal.mythical.total}
    > ${Shards.emoji.sacred } ${account.mercy.sacred.legendary.total}
    
    ${Text.set(`Last Active ${Timestamp.monthDay(account.lastActive)}`).constrain(21, {align: 'center'}).style(['code'])}` 
            return message
        },

        account: (account) =>
        {
            const message =
`
${Text.set(`${account.name}`).constrain(57, { style: ['block_code'], align: 'center'})}
`
            return message;
        },

        main: (account) =>
        {
            const message =
`
${Text.set(`${indicator.color.green[account.main]} ${Text.set(`main`).constrain(12, { align: 'center'})}`).constrain(17, { style: ['block_code']})}
`
            return message;
        },

        member: (account) =>
        {
            const message =
`
${Text.set(`${account.member.username}`).constrain(17, {style: ['block_code'], align: 'center'})}
`
            return message;
        },

        lastActive: (account) =>
        {
            const message =
`
${Text.set(`active: ${Text.set(`${Timestamp.monthDay(account.lastActive)}`).constrain(8, {align: 'right'})}`).constrain(17, {style: ['block_code']})}
`
            return message;
        },

        accountFeed: (member) => 
        {
            let message = ``;
            const feed = member.account.allAccountsFeed().slice(0, 3);
        
            for (const entry of feed) 
            {
                message += `${Text.set(`${entry.log}`).constrain(56, {style: ['block_code']})}`;
            }
        
            for (let i = feed.length; i < 3; i++) {
                message += `${Text.set(`${Timestamp.monthDay()}: More to come!`).constrain(58, { style: ['block_code'] })}`;
            }
        
            return message;
        },

        mercy: 
        {
            header: () =>
            {
                const message =
`
${Text.set(`Mercy settings`).constrain(56, {style: ['block_code'], align: 'center'})}
`
                return message;
            },

            template: (account) =>
            {

                const active = account.settings.template.options.getActive();

                const message = 
`
${Text.set(`template: ${Text.set(`${active}`).constrain(6, { align: 'right' })}`).constrain(17, { style: ['block_code']})}
`
                return message
            },

            prism: (account) => 
            {
                const prism = account.settings.template.display.prism.get()
        
                const message =
`
${Text.set(`prism: ${Text.set(`${indicator.onoff[prism]}`).constrain(8, {align: 'right'})}`).constrain(17, { style: ['block_code']})}
`
                return message;
            },

            tracking: () =>
            {
                const message =
`
${Text.set(`Mercy tracking`).constrain(56, {style: ['block_code'], align: 'center'})}
`
                return message;
            },
            
            mercy: (account) => 
            {
                const mercy = account.settings.template.display.mercy.get()
        
                const message =
`
${Text.set(`mercy: ${Text.set(`${indicator.onoff[mercy]}`).constrain(9, {align: 'right'})}`).constrain(17, { style: ['block_code']})}
`
                return message;
            },

            lastAdded: (account) => 
            {
                const lastAdded = account.settings.template.display.lastAdded.get()
        
                const message =
`
${Text.set(`last added: ${Text.set(`${indicator.onoff[lastAdded]}`).constrain(4, {align: 'right'})}`).constrain(17, { style: ['block_code']})}
`
                return message;
            },      

            lastReset: (account) => 
            {
                const lastReset = account.settings.template.display.lastReset.get()
        
                const message =
`
${Text.set(`last Reset: ${Text.set(`${indicator.onoff[lastReset]}`).constrain(4, {align: 'right'})}`).constrain(17, { style: ['block_code']})}
`
                return message;
            },            
            
            lastChampion: (account) => 
            {
                const lastChampion = account.settings.template.display.lastChampion.get()
        
                const message =
`
${Text.set(`last champ: ${Text.set(`${indicator.onoff[lastChampion]}`).constrain(4, {align: 'right'})}`).constrain(17, { style: ['block_code']})}
`
                return message;
            },            
            
            lifetime: (account) => 
            {
                const lifetime = account.settings.template.display.lifetime.get()
        
                const message =
`
${Text.set(`lifetime: ${Text.set(`${indicator.onoff[lifetime]}`).constrain(6, {align: 'right'})}`).constrain(17, { style: ['block_code']})}
`
                return message;
            },            
            
            session: (account) => 
            {
                const session = account.settings.template.display.session.get()
        
                const message =
`
${Text.set(`session: ${Text.set(`${indicator.onoff[session]}`).constrain(7, {align: 'right'})}`).constrain(17, { style: ['block_code']})}
`
                return message;
            },

            selection: () =>
            {
                const message =
`
${Text.set(`Mercy template`).constrain(56, {style: ['block_code'], align: 'center'})}
`
                return message;
            },
            
            currentSelection: (account) => {
                const active = account.settings.template.options.getActive();
            
                const selection = 
                {
                    static: `${account.data.template.selection[active]?.join(', ')}`,
                    rotate: `${account.data.template.selection[active]?.join(', ')}`,
                    random: `${['All backgrounds'].join(', ')}`,
                    custom: `${account.data.template.selection[active]?.join(', ')}`,
                    text:   `${['Text'].join(', ')}`
                };
            
                const intro =
                {
                    static:  `${Text.set(`static: Use one background image`).constrain(62)}`,
                    rotate:  `${Text.set(`rotate: Cycle through a set of backgrounds in order`).constrain(62)}`,
                    random:  `${Text.set(`random: Pick a new background at random each time`).constrain(62)}`,
                    custom:  `${Text.set(`custom: Randomly pick from your selected backgrounds`).constrain(62)}`,
                    text:    `${Text.set(`text: Simple text display with current count and mercy %`).constrain(62)}`,                    
                }

                const message =
`
${Text.set(`${intro[active] || 'No selection available'}\n\nselection: ${selection[active] || ' '} `).constrain(100, { style: ['block_code'], paddingChar: ' '})}
`
                return message;
            }
        }
    },

    }


export { template }

