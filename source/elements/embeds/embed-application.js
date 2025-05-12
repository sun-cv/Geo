import { EmbedBuilder }         from '@discordjs/builders';
import { Embed, Flags, Schema, Text }  from '#utils';
import { template }             from '#resources/templates/template-application.js';


const flag = Flags.from({ autoload: true })

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
            { button:   ['button-application-back', 'button-application-blank', 'button-application-next'] },
            { menu:     ['menu-application-clan-select'] },
        ],

        load: function(interaction)
        {
            const { member, client: { clanManagement: { applications }} } = interaction;
            const application = applications.getApplication(member);

            const embed     = new EmbedBuilder().setColor(0xED8223).addFields
            (
                { name: ' ', value: `${Text.set(`${application.account}'s Application`).constrain(58, { align: 'center', style: ['block_code']})}`, inline: false }
            )
        
            embed.addFields
            (
                { name: ' ', value: template.clan(application),      inline: true },
                { name: ' ', value: template.siege(application),     inline: true },
                { name: ' ', value: template.cvc(application),       inline: true },
                { name: ' ', value: template.question(application),  inline: false},
                { name: ' ', value: template.clanBoss(application),  inline: true },
                { name: ' ', value: template.hydra(application),     inline: true },
                { name: ' ', value: template.chimera(application),   inline: true },
            )

            return embed;
        },

        execute: function() {}
    }),

    'application-apply-submit': Schema.embed
    ({
        meta: 
        {
            id: "embed-application-apply-submit"
        },

        load: function(interaction)
        {
            const { member, client: { clanManagement: { applications }} } = interaction;
            const application = applications.getApplication(member);

            const embed     = new EmbedBuilder().setColor(0xED8223).addFields
            (
                { name: ' ', value: `${Text.set(`${application.account}'s Application`).constrain(58, { align: 'center', style: ['block_code']})}`, inline: false }
            )
        
            embed.addFields
            (
                { name: ' ', value: `${Text.set(`Thank you for your ${application.request == "application" ? "application" : "transfer request"}!\n\nThe ${application.selection.preferred} leadership will reach out if an opening is available`).constrain(300, {style: ['block_code']})}`, inline: true },
            )

            return embed;
        },

        execute: function() {}
    }),

    'application-officer-notification': Schema.embed
    ({
        meta: 
        {
            id: "embed-application-officer-notification"
        },

        load: function(interaction)
        {
            const { member, client: { clanManagement: { applications }} } = interaction;
            const application = applications.getApplication(member)

            const embed     = new EmbedBuilder().setColor(0xED8223).addFields
            (
                { name: ' ', value: `${Text.set(`Request: ${application.request} `).constrain(50, {style: ['block_code']})}`, inline: true },
                { name: ' ', value: `${Text.set(`Clan: ${application.clan} `).constrain(50, {style: ['block_code']})}`, inline: true },
            )

            embed.addFields
            (
                { name: ' ', value:` ${Text.set(`${Text.set(application.member.username).constrain(56, { align: 'center', style: ['block_code'] })}`)}`, inline: false},
                { name: ' ', value: template.applicationCard1(application), inline: true },
                { name: ' ', value: template.applicationCard2(application), inline: true },
            )

            return embed;
        },

        execute: function() {}
    }),

    'application-officer-notification-transfer': Schema.embed
    ({
        meta: 
        {
            id: "embed-application-officer-notification-transfer"
        },

        load: function(interaction)
        {
            const { member, client: { clanManagement: { applications, applications: {cache: { active }} }} } = interaction;
            const application = applications.getApplication({id: active.get(member.id)})

            const embed     = new EmbedBuilder().setColor(0xED8223).addFields
            (
                { name: ' ', value: `${Text.set(`Request: ${application.request} `).constrain(50, {style: ['block_code']})}`, inline: true },
                { name: ' ', value: `${Text.set(`Clan: ${application.clan} `).constrain(50, {style: ['block_code']})}`, inline: true },
            )

            embed.addFields
            (
                { name: ' ', value:`${Text.set(`${Text.set(application.member.username).constrain(56, { align: 'center', style: ['block_code'] })}`)}`, inline: false},
                { name: ' ', value:`${Text.set(`${Text.set(`Reassigned by ${interaction.member.user.username} from: ${application.admin.transfer.from}`).constrain(56, { align: 'center', style: ['block_code'] })}`)}`, inline: false},
                { name: ' ', value: template.applicationCard1(application), inline: true },
                { name: ' ', value: template.applicationCard2(application), inline: true },
            )

            return embed;
        },

        execute: function() {}
    }),

    'application-officer-notification-accepted': Schema.embed
    ({
        meta: 
        {
            id: "embed-application-officer-notification-accepted"
        },

        load: function(interaction)
        {
            const { member, client: { clanManagement: { applications, applications: {cache: { active }} }} } = interaction;

            const application = applications.getApplication({id: active.get(member.id)})

            const embed     = new EmbedBuilder().setColor(0xED8223).addFields
            (
                { name: ' ', value: `${Text.set(`Request: ${application.request} `).constrain(50, {style: ['block_code']})}`, inline: true },
                { name: ' ', value: `${Text.set(`Clan: ${application.clan} `).constrain(50, {style: ['block_code']})}`, inline: true },
            )

            embed.addFields
            (
                { name: ' ', value:`${Text.set(`${Text.set(application.member.username).constrain(56, { align: 'center', style: ['block_code'] })}`)}`, inline: false},
                { name: ' ', value:`${Text.set(`${Text.set(`Successfully Accepted by ${interaction.member.user.username}`).constrain(56, { align: 'center', style: ['block_code'] })}`)}`, inline: false},
            )


            return embed;
        },

        execute: function() {}
    }),

    'application-officer-notification-declined': Schema.embed
    ({
        meta: 
        {
            id: "embed-application-officer-notification-declined"
        },

        load: function(interaction)
        {
            const { member, client: { clanManagement: { applications, applications: {cache: { active }} }} } = interaction;

            const application = applications.getApplication({id: active.get(member.id)})

            const embed     = new EmbedBuilder().setColor(0xED8223).addFields
            (
                { name: ' ', value: `${Text.set(`Request: ${application.request} `).constrain(50, {style: ['block_code']})}`, inline: true },
                { name: ' ', value: `${Text.set(`Clan: ${application.clan} `).constrain(50, {style: ['block_code']})}`, inline: true },
            )

            embed.addFields
            (
                { name: ' ', value:` ${Text.set(`${Text.set(application.member.username).constrain(56, { align: 'center', style: ['block_code'] })}`)}`, inline: false},
                { name: ' ', value:`${Text.set(`${Text.set(`Successfully Declined by ${interaction.member.user.username}`).constrain(56, { align: 'center', style: ['block_code'] })}`)}`, inline: false},

            )

            return embed;
        },

        execute: function() {}
    }),


    'application-management-home': Schema.embed
    ({
        meta: 
        {
            id: "embed-application-management-home"
        },

        row:
        [
            { button:   ['button-application-management-submit', 'button-application-management-accept', 'button-application-management-decline', 'button-back-small'] },
            { menu:     ['menu-application-management-clan-select'] },
        ],

        load: function(interaction)
        {
            const { member, client: { clanManagement: { applications, applications: {cache: { active}} }} } = interaction;

            const application = applications.getApplication({id: active.get(member.id)})


            const embed     = new EmbedBuilder().setColor(0xED8223).addFields
            (
                { name: ' ', value: `${Text.set(`${application.account}'s Application`).constrain(58, { align: 'center', style: ['block_code']})}`, inline: false }
            )
        
            embed.addFields
            (
                { name: ' ', value: template.management.clan(application),      inline: true },
                { name: ' ', value: template.management.siege(application),     inline: true },
                { name: ' ', value: template.management.cvc(application),       inline: true },
                { name: ' ', value: template.management.message(application),   inline: false},
                { name: ' ', value: template.management.clanBoss(application),  inline: true },
                { name: ' ', value: template.management.hydra(application),     inline: true },
                { name: ' ', value: template.management.chimera(application),   inline: true },
            )

            return embed;
        },

        execute: function() {}
    }),
}


export { flag }
export default data