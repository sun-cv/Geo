import { EmbedBuilder }         from '@discordjs/builders';
import { Embed, Schema, Text }   from '../../../utility/index.js';
import { template }             from '../../data/template/templateMercy.js';



const data = 
{

    'mercy-greeting': Schema.embed
    ({
        meta: 
        {
            id: "embed-mercy-greeting"
        },

        load: function(interaction)
        {
            const { mercy } = interaction.client

            
            const member    = mercy.initialize(interaction);
            const account   = member.account.get();
                
            const embed     = new EmbedBuilder().setColor(0xED8223).addFields
            (
                { name: ' ', value: template.greeting.welcome(interaction), inline: false   },
                { name: ' ', value: template.greeting.leftbreakdown(),      inline: true    },
                { name: ' ', value: template.account.accountLanding(account),       inline: true    },
                { name: ' ', value: template.greeting.rightbreakdown(),     inline: true    },
            )
                        
            embed.addFields
            (
                { name: ' ', value: template.greeting.options(), inline: false },
                { name: ' ', value: '- Custom metrics', inline: true},
                { name: ' ', value: '- Custom backgrounds', inline: true},
                { name: ' ', value: '- Text based Mercy', inline: true},
                { name: ' ', value: template.greeting.signoff(), inline: false},
            )            

            return embed;
        },

        execute: function() {}
    }),



    'mercy-account-landing': Schema.embed
    ({
        meta: 
        {
            id: "embed-mercy-account-landing"
        },

        row:
        [
            {
                button: ['button--accounts-add-account','button-accounts-select-account', 'button-accounts-delete-account']
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
                embed.addFields({ name: ' ', value: template.account.accountLanding(account), inline: true });
            })
            
            Embed.set(embed).buffer(((3 - (sorted.length % 3)) % 3), 17, true);
            
            embed.addFields
            (
                { name: ' ', value: `${Text.set(`Recent activity`).constrain(58, {style: ['block_code'], align: 'center'})}`,                                    inline: false },
                { name: ' ', value: template.account.accountFeed(member),   inline: false },
            )              
            
            return embed;
        },

        execute: function() {}
    }),

    'account-home': Schema.embed
    ({
        meta: 
        {
            id: "embed-mercy-account-home"
        },

        row:
        [
            { button: ['button-account-settings','button-account-tracking', 'button-account-template'] },
            { button: ['button-account-main', 'button-account-name', 'button-back-small'] },

        ],
            
        load: (interaction) =>
        {
            const { mercy } = interaction.client

            const member    = mercy.initialize(interaction);
            const account   = member.account.getActive();

            const embed     = new EmbedBuilder().setColor(0xED8223).addFields
            (
                { name: ' ', value: template.account.account(account),      inline: false },
                { name: ' ', value: template.account.main(account),         inline: true  },
                { name: ' ', value: template.account.member(account),       inline: true  },
                { name: ' ', value: template.account.lastActive(account),   inline: true  },
                { name: ' ', value: ' ',                                    inline: false },
                { name: ' ', value: template.account.mercy.header(),        inline: false },
                { name: ' ', value: template.account.mercy.prism(account),  inline: true  },            
            )

            Embed.set(embed).buffer(1, 17, true)

            embed.addFields
            (
                { name: ' ', value: template.account.mercy.template(account),           inline: true  },
                { name: ' ', value: ' ',                                                inline: false },
                { name: ' ', value: template.account.mercy.tracking(),                  inline: false },
                { name: ' ', value: template.account.mercy.mercy(account),              inline: true  },
                { name: ' ', value: template.account.mercy.lifetime(account),           inline: true  },
                { name: ' ', value: template.account.mercy.session(account),            inline: true  },
                { name: ' ', value: template.account.mercy.lastAdded(account),          inline: true  },
                { name: ' ', value: template.account.mercy.lastReset(account),          inline: true  },
                { name: ' ', value: template.account.mercy.lastChampion(account),       inline: true  },
                { name: ' ', value: template.account.mercy.selection(),                 inline: false },
                { name: ' ', value: template.account.mercy.currentSelection(account),   inline: false },
            )

            return embed;
        },
        execute: () => {}
    })
}





export default data