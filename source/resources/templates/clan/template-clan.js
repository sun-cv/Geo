import { Text, Timestamp }      from '#utils'
import indicator                from '#resources/mapping/indicator.json' with {type: 'json'}

const template = 
{
    landing: (clan) => 
    {
        const { leadership, recruitment: { clanboss, hydra, chimera, cvc, siege } } = clan;
        const leadershipMap = Object.values(leadership).flat().map((member) => member ? `<@${member}>` : '').slice(0, 3);

        const message = 
`
${Text.set(`${indicator.color.green[clan.member.count < 30]} ${clan.member.count}/30  |  ${Text.set(clan.clan).constrain(36)} ${clan.recruitment.clanTag ? '[CPR]' : ''}`).constrain(58, { style: ['block_code'] })}
> ${Text.set(`Demon  : ${clanboss.custom || `${clanboss.keys} key ${clanboss.difficulty}`}`).constrain(41, { style: ['code'] })} ⠀${Text.set(`Siege  : ${siege.custom || (siege.required ? 'required' : 'optional')}`)   .constrain(20, { style: ['code'] })}
> ${Text.set(`Hydra  : ${hydra.custom || `${hydra.keys} key ${hydra.difficulty}`}`)         .constrain(41, { style: ['code'] })} ⠀${Text.set(`CVC    : ${cvc.custom  || `${cvc.points}k minimum`}`)                      .constrain(20, { style: ['code'] })}
> ${Text.set(`Chimera: ${chimera.custom || `${chimera.keys} key ${chimera.difficulty}`}`)   .constrain(41, { style: ['code'] })}

> ${leadershipMap.length > 1 ? leadershipMap : 'TBD'}
`;

        return message;
    },


    home: (clan) =>
    {

        const applications  = clan.applications.cache.application.filter(app => app.clan === clan.clan);
        const transfers     = clan.applications.cache.transfer.filter(app => app.clan === clan.clan);
        
        const array         = [...applications, ...transfers];
        const wait          = array.length > 0 ? Timestamp.monthDay(array.reduce((oldest, entry) => (entry.timestamp < oldest.timestamp ? entry : oldest)).timestamp) : 'none';

        const message       =
`
${Text.set(`${indicator.color.green[clan.member.count < 30]} ${Text.set(clan.clan).constrain(13)}`).constrain(18, { style: ['block_code'] })}
> ${Text.set(`   Transfer:   ${transfers.size    == 0 ? '0' : transfers.size}`)   .constrain(19, {style: ['code']})}
> ${Text.set(`Application:   ${applications.size == 0 ? '0' : applications.size}`).constrain(19, {style: ['code']})}
`
        return message
    },

    // CLAN INFO
    info:
    {
        member: (interaction) =>
        {
            const { client: { clanManagement: { cache }}, member} = interaction;
    
            const clan      = cache.clones.get(member.id)   
            const message =
`
${Text.set(`${Text.set(`${indicator.color.green[clan.member.count < 30]} ${clan.member.count}/30`).constrain(14, {align: 'center'})}`).constrain(17, {style: ['block_code']})}
`   
            return message;
        },
        

        tag: (interaction) =>
        {
            const { client: { clanManagement: { cache }}, member} = interaction;

            const clan      = cache.clones.get(member.id)
            const message =
`
${Text.set(`Tag: ${Text.set(`[${clan.tag}]`).constrain(10, {align: 'right'})}`).constrain(17, {style: ['block_code']})}
`   
            return message;
        },


        level: (interaction) =>
        {
            const { client: { clanManagement: { cache }}, member} = interaction;

            const clan      = cache.clones.get(member.id)
            const message   =
`
${Text.set(`Level: ${Text.set(`${clan.level}`).constrain(8, {align: 'right'})}`).constrain(17, {style: ['block_code']})}
`   
            return message;
        },

        leadership: (interaction) =>
        {
            const { client: { clanManagement: { cache }}, member} = interaction;

            const clan              = cache.clones.get(member.id)
            const { leadership }    = clan;
            const leadershipMap     = Object.values(leadership).flat().map((member) => member ? `<@${member}>` : '');

            const message =
`
${Text.set(`Leadership:`).constrain(20, {style: ['block_code']})}
> ${Text.set(`${leadershipMap.length > 1 ? leadershipMap : 'TBD'}`).constrain(110, {paddingChar: ' ⠀'})}

` 
            return message;
        },

        clanboss: (interaction) =>
        {
            const { client: { clanManagement: { cache }}, member} = interaction;

            const clan      = cache.clones.get(member.id)
            const clearing  = clan.statistics.clanboss.clearing.join(', ');
            const custom    = clan.recruitment.clanboss.custom

            const message   =
`
${Text.set(` Demon Lord:`).constrain(18, {style: ['block_code']})}
> Clearing: ${clearing ? clearing : '⠀'}
> ${Text.set(`${custom ? custom : '⠀'}`).constrain(100)}
`   
            return message;
        },        
        
        hydra: (interaction) =>
        {
            const { client: { clanManagement: { cache }}, member} = interaction;

            const clan      = cache.clones.get(member.id)
            const clearing  = clan.statistics.hydra.clearing.join(', ');
            const custom    = clan.recruitment.hydra.custom

            const message   =
`
${Text.set(` Hydra:`).constrain(18, {style: ['block_code']})}
> Clearing: ${clearing ? clearing : '⠀'}
> ${Text.set(`${custom ? custom : '⠀'}`).constrain(100)}
`
            return message;
        },        
        

        chimera: (interaction) =>
        {
            const { client: { clanManagement: { cache }}, member} = interaction;

            const clan      = cache.clones.get(member.id)
            const clearing  = clan.statistics.chimera.clearing.join(', ');
            const custom    = clan.recruitment.chimera.custom

            const message   =
`
${Text.set(` Chimera:`).constrain(18, {style: ['block_code']})}
> Clearing: ${clearing ? clearing : '⠀'}
> ${Text.set(`${custom ? custom : '⠀'}`).constrain(100)}
`   
return message;
        },

        cvc: (interaction) =>
        {
            const { client: { clanManagement: { cache }}, member} = interaction;

            const clan      = cache.clones.get(member.id)
            const message   =
`
${Text.set(` ${indicator.color.green[clan.recruitment.cvc.required]} CvC: ${Text.set(`points: ${clan.statistics.cvc.average}`).constrain(17, {align: 'right'})}`).constrain(26, {style: ['block_code']})}
> ${clan.recruitment.cvc.custom}⠀

`   
            return message;
        },
        
        
        siege: (interaction) =>
        {
            const { client: { clanManagement: { cache }}, member} = interaction;

            const clan      = cache.clones.get(member.id)
            const message   =
`
${Text.set(` ${indicator.color.green[clan.recruitment.siege.required]} Siege:`).constrain(18, {style: ['block_code']})}
> ${clan.recruitment.siege.custom}⠀
`   
            return message;
        },

        customMessage: (interaction) =>
        {
            const { client: { clanManagement: { cache }}, member} = interaction;

            const clan      = cache.clones.get(member.id)
            const message =
`
${Text.set(`Description:`).constrain(54, {style: ['block_code']})}${Text.set(`${clan.recruitment.message ? clan.recruitment.message : ' '}`).constrain(900, {style: ['block_code']})}
`
            return message
        }

    },

    // CLAN MANAGEMENT

    management:  
    {
        member: (interaction) =>
        {
            const { client: { clanManagement: { cache }}, member} = interaction;
    
            const clan      = cache.clones.get(member.id)
            const selection = cache.selection.get(member.id);
   
            const message   =
`
${Text.set(`${selection == 0 ? '▶' : ' '}${Text.set(`${indicator.color.green[clan.member.count < 30]} ${clan.member.count}/30`).constrain(14, {align: 'center'})}`).constrain(17, {style: ['block_code']})}
`   
            return message;
        },
        

        tag: (interaction) =>
        {
            const { client: { clanManagement: { cache }}, member} = interaction;

            const clan      = cache.clones.get(member.id)
            const selection = cache.selection.get(member.id);

            const message =
`
${Text.set(`${selection == 1 ? '▶' : ' '}Tag: ${Text.set(`[${clan.tag}]`).constrain(10, {align: 'right'})}`).constrain(17, {style: ['block_code']})}
`   
            return message;
        },


        level: (interaction) =>
        {
            const { client: { clanManagement: { cache }}, member} = interaction;

            const clan      = cache.clones.get(member.id)
            const selection = cache.selection.get(member.id);

            const message =
`
${Text.set(`${selection == 2 ? '▶' : ' '}Level: ${Text.set(`${clan.level}`).constrain(8, {align: 'right'})}`).constrain(17, {style: ['block_code']})}
`   
            return message;
        },


        leadership: (interaction) =>
        {
            const { client: { clanManagement: { cache }}, member} = interaction;

            const clan      = cache.clones.get(member.id)
            const selection = cache.selection.get(member.id);

            const { leadership } = clan;
            const leadershipMap = Object.values(leadership).flat().map((member) => member ? `<@${member}>` : '');

            const message =
`
>>> ${Text.set(`${selection == 3 ? '▶' : ' '}`)}${Text.set(`${leadershipMap.length > 1 ? leadershipMap : 'TBD'}`).constrain(110, {paddingChar: ' ⠀'})}

` 
            return message;
        },


        clanboss: (interaction) =>
        {
            const { client: { clanManagement: { cache }}, member} = interaction;

            const clan      = cache.clones.get(member.id)
            const selection = cache.selection.get(member.id);

            const clearing  = clan.statistics.clanboss.clearing.join(', ');
            const custom    = clan.recruitment.clanboss.custom


            const message =
`
${Text.set(` Demon Lord:`).constrain(18, {style: ['block_code']})}
> ${Text.set(`${selection == 4  ? '▶' : ' '}1: ${Text.set(`${clearing ? clearing : '⠀'} `                        ).constrain(13, {align: 'right'})}`).constrain(18, {style: ['code']})}
> ${Text.set(`${selection == 7  ? '▶' : ' '}2: ${Text.set(`${clan.recruitment.clanboss.keys} `                   ).constrain(13, {align: 'right'})}`).constrain(18, {style: ['code']})}
> ${Text.set(`${selection == 10 ? '▶' : ' '}3: ${Text.set(`${clan.recruitment.clanboss.difficulty} `             ).constrain(13, {align: 'right'})}`).constrain(18, {style: ['code']})}
> ${Text.set(`${selection == 13 ? '▶' : ' '}4: ${Text.set(`${custom ? custom : '⠀'} `                            ).constrain(13, {align: 'right'})}`).constrain(18, {style: ['code']})}
`   
            return message;
        },        
        
        hydra: (interaction) =>
        {
            const { client: { clanManagement: { cache }}, member} = interaction;

            const clan      = cache.clones.get(member.id)
            const selection = cache.selection.get(member.id);

            const clearing  = clan.statistics.hydra.clearing.join(', ');
            const custom    = clan.recruitment.hydra.custom

            const message =
`
${Text.set(` Hydra:`).constrain(18, {style: ['block_code']})}
> ${Text.set(`${selection == 5  ? '▶' : ' '}${Text.set(`${clearing ? clearing : '⠀'} `                       ).constrain(16, {align: 'right'})}`).constrain(18, {style: ['code']})}
> ${Text.set(`${selection == 8  ? '▶' : ' '}${Text.set(`${clan.recruitment.hydra.keys} `                     ).constrain(16, {align: 'right'})}`).constrain(18, {style: ['code']})}
> ${Text.set(`${selection == 11 ? '▶' : ' '}${Text.set(`${clan.recruitment.hydra.difficulty} `               ).constrain(16, {align: 'right'})}`).constrain(18, {style: ['code']})}
> ${Text.set(`${selection == 14 ? '▶' : ' '}${Text.set(`${custom ? custom : '⠀'} `                           ).constrain(16, {align: 'right'})}`).constrain(18, {style: ['code']})}
`
            return message;
        },        
        

        chimera: (interaction) =>
        {
            const { client: { clanManagement: { cache }}, member} = interaction;

            const clan      = cache.clones.get(member.id)
            const selection = cache.selection.get(member.id);

            const clearing  = clan.statistics.chimera.clearing.join(', ');
            const custom    = clan.recruitment.chimera.custom

            const message =
`
${Text.set(` Chimera:`).constrain(18, {style: ['block_code']})}
> ${Text.set(`${selection == 6  ? '▶' : ' '}${Text.set(`${clearing ? clearing : '⠀'} `                      ).constrain(16, {align: 'right'})}`).constrain(18, {style: ['code']})}
> ${Text.set(`${selection == 9  ? '▶' : ' '}${Text.set(`${clan.recruitment.chimera.keys} `                  ).constrain(16, {align: 'right'})}`).constrain(18, {style: ['code']})}
> ${Text.set(`${selection == 12 ? '▶' : ' '}${Text.set(`${clan.recruitment.chimera.difficulty} `            ).constrain(16, {align: 'right'})}`).constrain(18, {style: ['code']})}
> ${Text.set(`${selection == 15 ? '▶' : ' '}${Text.set(`${custom ? custom : '⠀'} `                          ).constrain(16, {align: 'right'})}`).constrain(18, {style: ['code']})}
`   
            return message;
        },

        cvc: (interaction) =>
        {
            const { client: { clanManagement: { cache }}, member} = interaction;

            const clan      = cache.clones.get(member.id)
            const selection = cache.selection.get(member.id);

            const message =
`
${Text.set(` CvC:`).constrain(18, {style: ['block_code']})}
> ${Text.set(`${selection == 16 ? '▶' : ' '}Req : ${Text.set(`${indicator.yesno[clan.recruitment.cvc.required]}`).constrain(10, {align: 'right'})}`).constrain(18, {style: ['code']})}
> ${Text.set(`${selection == 19 ? '▶' : ' '}Avg : ${Text.set(`${clan.recruitment.cvc.average}`                   ).constrain(10, {align: 'right'})}`).constrain(18, {style: ['code']})}
> ${Text.set(`${selection == 22 ? '▶' : ' '}Cust: ${Text.set(`${clan.recruitment.cvc.custom}`                   ).constrain(10, {align: 'right'})}`).constrain(18, {style: ['code']})}

`   
            return message;
        },
        
        
        siege: (interaction) =>
        {
            const { client: { clanManagement: { cache }}, member} = interaction;

            const clan      = cache.clones.get(member.id)
            const selection = cache.selection.get(member.id);

            const message =
`
${Text.set(` Siege:`).constrain(18, {style: ['block_code']})}
> ${Text.set(`${selection == 16 ? '▶' : ' '}Req : ${Text.set(`${indicator.yesno[clan.recruitment.siege.required]} ` ).constrain(10, {align: 'right'})}`).constrain(18, {style: ['code']})}
> ${Text.set(`${selection == 19 ? '▶' : ' '}Cust: ${Text.set(`${clan.recruitment.siege.custom} `                    ).constrain(10, {align: 'right'})}`).constrain(18, {style: ['code']})}
`   
            return message;
        },
        
        
        settings: (interaction) =>
        {
            const { client: { clanManagement: { cache }}, member} = interaction;

            const clan      = cache.clones.get(member.id)
            const selection = cache.selection.get(member.id);

            const message =
`
${Text.set(` Settings:`).constrain(18, {style: ['block_code']})}
> ${Text.set(`${selection == 18 ? '▶' : ' '}Auto Accept: ${Text.set(`${indicator.onoff[clan.settings.autoAccept]} `).constrain(4, {align: 'right'})}`).constrain(18, {style: ['code']})}
> ${Text.set(`${selection == 21 ? '▶' : ' '}Auto Clear : ${Text.set(`${indicator.onoff[clan.settings.autoClear]} ` ).constrain(4, {align: 'right'})}`).constrain(18, {style: ['code']})}

`   
            return message;
        },
    
        customMessage: (interaction) =>
        {
            const { client: { clanManagement: { cache }}, member} = interaction;

            const clan      = cache.clones.get(member.id)
            const selection = cache.selection.get(member.id);


            const message =
`
${Text.set(`${selection == 23 ? '▶' : ' '}Recruiting message:`).constrain(54, {style: ['block_code']})}${Text.set(`${clan.recruitment.message ? clan.recruitment.message : ' '}`).constrain(200, {style: ['block_code']})}
`
            return message
        },

        applications: (interaction) =>
        {
            const { client: { clanManagement, clanManagement: { cache: { active } }}, member} = interaction;
    
            const clan          = clanManagement.clan[active.get(member.id)]
            const applications  = clan.applications.cache.application.filter(app => app.clan === clan.clan);
        
            const message       =
    `
    ${Text.set(`Applications: ${Text.set(`${applications.size == 0 ? '0' : applications.size}`).constrain(11, { align: 'right'})}`).constrain(28, {style: ['block_code']})}
    `
            return message
        },

        transfers: (interaction) =>
        {
            const { client: { clanManagement, clanManagement: { cache: { active } }}, member} = interaction;
    
            const clan          = clanManagement.clan[active.get(member.id)]
            const transfers     = clan.applications.cache.transfer.filter(app => app.clan === clan.clan);
                
            const message       =
    `
    ${Text.set(`Transfers: ${Text.set(`${transfers.size == 0 ? '0' : transfers.size}`).constrain(14, { align: 'right'})}`).constrain(28, {style: ['block_code']})}
    `
            return message
        }

    }

    

};




export { template }
