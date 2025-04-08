import { EmbedBuilder }         from '@discordjs/builders';
import { Embed,Schema, Text }   from '../../../utility/index.js';
import { template }             from '../../data/template/mercy.js';



const data = 
{
    'mercy-home': Schema.embed
    ({
        meta: 
        {
            id: "embed-mercy-home"
        },

        row:
        [
            {
                button: ['button-mercy-home-profile', 'button-mercy-home-accounts', 'button-mercy-home-data']
            }
        ],

        load: function(interaction)
        {
            const { mercy } = interaction.client

            const member    = mercy.initialize(interaction);
            const sorted    = [...member.account.cache.values()].sort((a,b) => b.main - a.main);

            const embed     = new EmbedBuilder().setColor(0xED8223).addFields
            (
                { name: ' ', value: `${Text.set(`${member.member}'s Accounts`).constrain(58, { align: 'center', style: ['block_code']})}`, inline: false }
            )
        
            sorted.forEach((account) =>
            {
                embed.addFields({ name: ' ', value: template.accountLanding(account), inline: true });
            })
            
            Embed.set(embed).buffer(((3 - (sorted.length % 3)) % 3), 17, true);
            
            embed.addFields
            (
                {name: ' ', value: `${Text.set('Manage:').constrain(58, { align: 'center', style: ['block_code']})}`,  inline: false},
            )              
            
            return embed;
        },

        execute: function() {}
    }),

    'accounts-home': Schema.embed
    ({
        meta: 
        {
            id: "embed-mercy-accounts-home"
        },

        row:
        [
            { button: ['button-mercy-accounts-add','button-mercy-accounts-select', 'button-mercy-accounts-delete'] },
            { button: ['button-back-small'] },
        ],
            
        load: (interaction) =>
        {
            const { mercy } = interaction.client

            const member    = mercy.initialize(interaction);
            const sorted    = [...member.account.cache.values()].sort((a,b) => b.main - a.main);

            const embed     = new EmbedBuilder().setColor(0xED8223).addFields
            (
                { name: ' ', value: `${Text.set(`${member.member}'s Accounts`).constrain(58, { align: 'center', style: ['block_code']})}`, inline: false }
            )
        
            sorted.forEach((account) =>
            {
                embed.addFields({ name: ' ', value: template.accountLanding(account), inline: true });
            })
            
            Embed.set(embed).buffer(((3 - (sorted.length % 3)) % 3), 17, true);

            embed.addFields
            (
                {name: ' ', value: `${Text.set('Options:').constrain(58, { align: 'center', style: ['block_code']})}`,  inline: false},
            )              
            
            return embed;
        },
        execute: () => {}
    })
}





export default data