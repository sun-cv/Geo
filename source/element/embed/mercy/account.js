import { EmbedBuilder }             from '@discordjs/builders';
import { Embed, Text, Timestamp }   from '../../../../utility/index.js';
import  indicator                   from '../../../data/mapping/indicator.json' with { type: 'json'}


const data = 
{
    meta: 
    {
        id:             "Account command embeds",
        type:           "embed",
        description:    "Account command embed collection",
    },

    flag: 
    {
        ignore: false
    },

    embed:
    {
        accountLanding: 
        {
            meta: 
            {
                id:             'mercy-account-landing',
                type:           'embed',
                description:    'Mercy tracker account landing page'
            },
        
            row:
            [
                {
                    button:     ['mercy-account-add', 'mercy-account-remove']
                },
                // {
                //     menu:       'account-selection'
                // }
            ],
        
            flag:
            {
                ephemeral:      true
            },

            execute:            (interaction) =>
            {
                const { mercy } = interaction.client  

                const member    = mercy.initialize(interaction);
                const sorted    = [...member.account.values()].sort((a,b) => b.main - a.main);

                const embed     = new EmbedBuilder().setColor(0xED8223).addFields
                (
                    { name: ' ', value: `${Text.set(`${member.member}'s Accounts`).constrain(58, { align: 'center', style: ['block_code']})}`, inline: false }
                )
            
                sorted.forEach((account) =>
                {
                    embed.addFields({ name: ' ', value: `${Text.set(`${indicator.color.green[account.main]} ${account.account}`).constrain(17, { style: ['block_code']})}\n> Last Active ${Timestamp.monthDay(account.lastActive)}`, inline: true });
                })
            
                Embed.set(embed).buffer(((3 - (sorted.length % 3)) % 3), 17, true)
                
                return embed;
            }
        }

        




    }

}



export default data