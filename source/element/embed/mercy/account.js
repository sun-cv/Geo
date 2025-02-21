import { EmbedBuilder }             from '@discordjs/builders';
import { Embed, Text, Timestamp }   from '../../../../utility/index.js';
import { indicator }                from '../../../data/mapping/indicator.json' with { type: 'json'}

function buildAccountLanding(member)
{
    const sorted = [...member.account.values()].sort((a,b) => b.main - a.main);

    const embed = new EmbedBuilder().setColor('#ED8223').addFields
    (
        { name: ' ', value: Text.set(`${member.member}'s Accounts`).constrain(58, { alignment: 'center',style: ['block_code']}), inline: true }
    )

    sorted.forEach((account) =>
    {
        embed.addFields({ name: ' ', value: `${Text.set(`${indicator.color.green[account.main]} ${account.account}`).constrain(17, { style: ['block_code']})}\n> Last Active ${Timestamp.monthDay(account.lastActive)}`, inline: true });
    })

    Embed.set(embed).buffer(((3 - (sorted.length % 3)) % 3), 50, true)

    return embed;
}



const AccountLanding = 
{
    meta: 
    {
        id:             "mercy-account-landing",
        type:           "embed",
        description:    "Mercy tracker account landing page",
    },

    execute: buildAccountLanding
}

export { AccountLanding }