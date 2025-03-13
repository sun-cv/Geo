import { EmbedBuilder }                             from '@discordjs/builders';
import { Embed, Input, Schema, Text, Timestamp }    from '../../../utility/index.js';
import message                                      from '../../command/mercy/system/message.js';

const data = 
{
    'application-apply-home': Schema.embed
    ({
        meta: 
        {
            id: "embed-application-apply-home"
        },

        row:
        [
            { button: ['button-application-back', 'button-application-message', 'button-application-next'] },
            { menu: 'menu-application-clan-select' },
        ],

        load: function(interaction)
        {
            const { member, client: { clanCluster: { applications }} } = interaction;
    
            if (interaction.isModalSubmit())
            {
                const { account_name }  = Input.modal(interaction);
                applications.getApplication(member, account_name);
            }

            const application = applications.getApplication(member);

            const embed     = new EmbedBuilder().setColor(0xED8223).addFields
            (
                { name: ' ', value: `${Text.set(`${application.account}'s Application`).constrain(58, { align: 'center', style: ['block_code']})}`, inline: false }
            )
        
            embed.addFields
            (
                { name: ' ', value: message.application.clan(application),      inline: true },
                { name: ' ', value: message.application.siege(application),     inline: true },
                { name: ' ', value: message.application.cvc(application),       inline: true },
                { name: ' ', value: message.application.question(application),  inline: false},
                { name: ' ', value: message.application.clanBoss(application),  inline: true },
                { name: ' ', value: message.application.hydra(application),     inline: true },
                { name: ' ', value: message.application.chimera(application),   inline: true },
            )



            return embed;
        },

        execute: function() {}
    }),

}





export default data






