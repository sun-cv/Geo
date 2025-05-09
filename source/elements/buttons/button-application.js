import { MessageFlags }                                         from 'discord.js';
import { Component, Text, EmbedManager, Schema, Timestamp }     from '#utils';
import { applicationConfig }                                    from '#commands/clan/config/application.js';
import { clanConfig }                                           from '#commands/clan/config/clan.js';
import { RoleAssignment }                                       from '#events/interaction/handler/role.js';
import { template }                                             from '#resources/templates/application/template-application.js';

const data = 
{

    'application-info': Schema.button
    ({
        meta: { id: 'button-application-info' },

        flag: 
        {
            defer: false,
        },

        load: function()
        {
            return Component
                .button (this.meta.id)
                .label  (`${Text.set(' Clan Recruitment Info ').constrain(61, {align: 'center', paddingChar: '⠀'})}`)
                .style  ('Secondary')
        },

        execute: async (interaction) => 
        {
            return interaction.reply(EmbedManager.set(interaction).load('embed-clan-info').create());
        }
    }),

    'application-apply': Schema.button
    ({
        meta: { id: 'button-application-apply' },

        flag: 
        {
            defer: false,
        },

        permission:
        {
            exclude:
            {
                active: true,
                message: 'You are already a member! Please request a transfer instead.',
                roles: applicationConfig.roles
            }
        },

        load: function()
        {
            return Component
                .button (this.meta.id)
                .label  (`${Text.set(' Apply ').constrain(27, {align: 'center', paddingChar: '⠀'})}`)
                .style  ('Success')
        },

        execute: async (interaction) => 
        {
            const { member, client: { registry, clanManagement: { applications }} } = interaction;

            if (applications.cache.application.has(member.id))
            {
                const application = applications.getApplication(member)

                if (application.meta.submitted)
                {
                    return interaction.reply({ content: `Your application was successfully submitted on ${Timestamp.monthDay(application.timestamp)} and is currently pending.`, flags: MessageFlags.Ephemeral })
                }
                return interaction.reply(EmbedManager.set(interaction).load('embed-application-apply-home').create());
            }

            const modal = registry.modal.get('modal-application-apply-name');
            registry.modal.cache.set(member.id, interaction.customId);
        
            await interaction.showModal(modal.load());
        }
    }),

    'application-transfer': Schema.button
    ({
        meta: { id: 'button-application-transfer' },

        flag: 
        {
            defer: false,
        },


        permission:
        {
            require:
            {
                active: true,
                message: 'You must be a clan member to request a transfer. Please select Apply',
                roles: applicationConfig.roles
            }
        },

        load: function()
        {
            return Component
                .button (this.meta.id)
                .label  (`${Text.set('Transfer').constrain(27, {align: 'center', paddingChar: '⠀'})}`)
                .style  ('Primary')
        },

        execute: async (interaction) => 
        {
            const { member, client: { registry, clanManagement: { applications }} } = interaction;

            if (applications.cache.transfer.has(member.id))
            {
                const application = applications.getApplication(member)

                if (application.meta.submitted)
                {
                    return interaction.editReply({ content: `Your application was successfully submitted on ${Timestamp.monthDay(application.timestamp)} and is currently pending.`, flags: MessageFlags.Ephemeral })
                }
            }

            if (!applications.hasApplicationRecord(member))
            {
                const modal = registry.modal.get('modal-application-transfer-name');
                registry.modal.cache.set(member.id, interaction.customId);
        
                await interaction.showModal(modal.load());
            }
            else
            {
                applications.createTransfer(member);
                return interaction.reply(EmbedManager.set(interaction).load('embed-application-apply-home').create());
            }
            
        }
    }),


    'application-management-submit': Schema.button
    ({
        meta: { id: 'button-application-management-submit' },

        flag:
        {
            update: true,
        },

        load: function(interaction)
        {
            return Component
                .button (this.meta.id)
                .label  (`${Text.set('Submit').constrain(9, {align: 'center', paddingChar: '⠀'})}`)
                .style  ('Primary')
        },
    
        execute: async function (interaction) 
        {
            const { member, client: { registry: { channels }, clanManagement, clanManagement: { officersTable, clan, clans, applications, applications: { cache } }}} = interaction;

            const application = applications.getApplication({id: cache.active.get(member.id)})

            if (application.status == 'declined')
            {
                channels.get(officersTable).send(EmbedManager.set(interaction).load('embed-application-officer-notification-declined').create());
            }
                
            if (application.status == 'accepted')
            {
                application.meta.accepted = true;
                clanManagement.addMember(application);
                clanManagement.applications.updateLanding(interaction)

                RoleAssignment.set(interaction, application.member.id).removeRole(...clans).addRole(application.clan)

                channels.get(officersTable).send(EmbedManager.set(interaction).load('embed-application-officer-notification-accepted').create());
                channels.get(clan[application.clan].channel.home).send(template.accepted(interaction, application));
            }
                    
            applications.updateApplication(application);
            applications.resetCache();

            interaction.editReply(EmbedManager.set(interaction).load('embed-clan-management-home').modify(clanConfig.landing()).create());
        }
    }),


    'application-management-accept': Schema.button
    ({
        meta: { id: 'button-application-management-accept' },

        flag:
        {
            update: true,
        },

        load: function(interaction)
        {
            const { member, client: { clanManagement: { applications, applications: { cache } }}} = interaction;
            const application = applications.getApplication({id: cache.active.get(member.id)})

            const style = application.status == 'accepted' ? 'Success' : 'Primary'

            return Component
                .button (this.meta.id)
                .label  (`${Text.set('Accept').constrain(10, {align: 'center', paddingChar: '⠀'})}`)
                .style  (style)
        },
    
        execute: async function (interaction) 
        {
            const { member, client: { clanManagement: { applications, applications: { cache } }}} = interaction;

            const application = applications.getApplication({id: cache.active.get(member.id)})

            application.status  = 'accepted';

            interaction.editReply(EmbedManager.set(interaction).load('embed-application-management-home').create());
        }
    }),


    'application-management-decline': Schema.button
    ({
        meta: { id: 'button-application-management-decline' },

        flag:
        {
            update: true,
        },

        load: function(interaction)
        {
            const { member, client: { clanManagement: { applications, applications: { cache } }}} = interaction;
            const application = applications.getApplication({id: cache.active.get(member.id)})

            const style = application.status == 'declined' ? 'Danger' : 'Primary'

            return Component
                .button (this.meta.id)
                .label  (`${Text.set('Decline').constrain(10, {align: 'center', paddingChar: '⠀'})}`)
                .style  (style)
        },
    
        execute: async function (interaction) 
        {
            const { member, client: { clanManagement: { applications, applications: { cache } }}} = interaction;

            const application = applications.getApplication({id: cache.active.get(member.id)})

            application.status  = 'declined';

            interaction.editReply(EmbedManager.set(interaction).load('embed-application-management-home').create());
        }
    }),



    'application-back': Schema.button
    ({
        meta: { id: 'button-application-back'},

        flag: 
        {
            update: true,
        },

        load: function()
        {
            return Component
                .button(this.meta.id)
                .setEmoji({name: 'left', id: '1241945527545757707'})
                .style ('Primary')
        },

        execute: (interaction) => 
        {
            const { member, client: { clanManagement: { applications }} } = interaction;
            const application = applications.getApplication(member);

            application.meta.location = (application.meta.location - 1 + applicationConfig.selection.count) % applicationConfig.selection.count;

            interaction.editReply(EmbedManager.set(interaction).load('embed-application-apply-home').modify(applicationConfig.getModifier(application)).create());
        }


    }),

    'application-blank': Schema.button
    ({
        meta: { id: 'button-application-blank'},

        flag: 
        {
            update: true
        },

        load: function(interaction)
        {
            const { member, client: { clanManagement: { applications }} } = interaction;

            return Component
                .button(this.meta.id)
                .label (`${Text.set(` `).constrain(38, {align: 'center', paddingChar: '⠀'})}`)
                .style ('Secondary')
        },

        execute: () => {}
    
    }),

    'application-next': Schema.button
    ({
        meta: { id: 'button-application-next'},

        flag: 
        {
            update: true,
        },

        load: function()
        {

            return Component
                .button(this.meta.id)
                .setEmoji({name: 'right', id: '1241945528447668224'})
                .style ('Primary')
        
        },
    
        execute: (interaction) => 
        {
            const { member, client: { clanManagement: { applications }} } = interaction;
            const application = applications.getApplication(member);

            application.meta.location = (application.meta.location + 1) % applicationConfig.selection.count;          
            
            interaction.editReply(EmbedManager.set(interaction).load('embed-application-apply-home').modify(applicationConfig.getModifier(application)).create());
        }
    }),

    'application-message': Schema.button
    ({
        meta: { id: 'button-application-message'},

        flag: 
        {
            defer: false,
        },

        load: function()
        {
            return Component
                .button(this.meta.id)
                .label(`${Text.set(` Click here `).constrain(42, {align: 'center', paddingChar: '⠀'})}`)
                .style ('Secondary')
        
        },
    
        execute: (interaction) => 
        {
            const { member, client: { registry, clanManagement: { applications }} } = interaction;

            const modal = registry.modal.get('modal-application-apply-message');
            registry.modal.cache.set(member.id, interaction.customId);
        
            interaction.showModal(modal.load());
        }
    }),

    'application-submit': Schema.button
    ({
        meta: { id: 'button-application-submit'},

        flag: 
        {
            update: true,
        },



        load: function()
        {
            return Component
                .button(this.meta.id)
                .label(`${Text.set(`Submit`).constrain(39, {align: 'center', paddingChar: '⠀'})}`)
                .style ('Primary')
        
        },
    
        execute: (interaction) => 
        {
            const { member, client: { registry: { channels, role }, clanManagement: { officersTable, applications }} } = interaction;
            
            const application = applications.getApplication(member);
            
            if (!application.valid())
            {
                return interaction.editReply(EmbedManager.set(interaction).load('embed-application-apply-home').modify(applicationConfig.getModifier(application)).create());
            }
           
            application.submit();
            
            interaction.editReply(EmbedManager.set(interaction).load('embed-application-apply-submit').create());

            channels.get(officersTable).send(`📢 Attention ${role.get(application.clan)}!`);
            channels.get(officersTable).send(EmbedManager.set(interaction).load('embed-application-officer-notification').create());

        }
    }),


    'application-view-application': Schema.button
    ({
        meta: { id: 'button-application-view-application' },

        flag:
        {
            update: true,
        },

        load: function(interaction)
        {
            return Component
                .button (this.meta.id)
                .label  (`${Text.set('Applications').constrain(12, {align: 'center', paddingChar: '⠀'})}`)
                .style  ('Primary')
        },
    
        execute: async function (interaction) 
        {
            interaction.editReply(EmbedManager.set(interaction).load('embed-clan-management-home').modify(clanConfig.application()).create());
        }
    }),

        'application-view-transfer': Schema.button
    ({
        meta: { id: 'button-application-view-transfer' },

        flag:
        {
            update: true,
        },

        load: function(interaction)
        {
            return Component
                .button (this.meta.id)
                .label  (`${Text.set('Transfers').constrain(11, {align: 'center', paddingChar: '⠀'})}`)
                .style  ('Primary')
        },
    
        execute: async function (interaction) 
        {
            
            interaction.editReply(EmbedManager.set(interaction).load('embed-clan-management-home').modify(clanConfig.transfer()).create());
        }
    }),
}


export default data;