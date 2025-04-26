import { Component, EmbedManager, Schema, Text }    from '#utils';
import { clanConfig }                               from '#commands/clan/config/clan.js';

const data = 
{


    
    'update-edit': Schema.button
    ({
        meta: { id: 'button-clan-update-edit' },

        flag:
        {
            update: true,
        },

        load: function(interaction)
        {
            return Component
                .button (this.meta.id)
                .label  (`${Text.set('Edit Clan').constrain(10, {align: 'center', paddingChar: '⠀'})}`)
                .style  ('Primary')
        },
    
        execute: async function (interaction) 
        {
            
            const { client: { clanManagement: { cache: { selection }} }, member } = interaction
            
            selection.set(member.id, 0);

            interaction.editReply(EmbedManager.set(interaction).load('embed-clan-management-home').modify(clanConfig.edit()).create());
        }
    }),
    
    'update-update': Schema.button
    ({
        meta: { id: 'button-clan-update-update' },

        flag:
        {
            update:  true
        },

        load: function(interaction)
        {
            return Component
                .button (this.meta.id)
                .label  (`${Text.set(' Update ').constrain(18, {align: 'center', paddingChar: '⠀'})}`)
                .style  ('Success')
        },
    
        execute: async function (interaction) 
        {
            const { member, client: { clanManagement, clanManagement: { cache: { clones }}}} = interaction;
            
            const clanData = clones.get(member.id);
            
            clanManagement.updateClan(clanData);
            clanManagement.resetCache(clanData.clan);
            clanManagement.applications.updateLanding(interaction)

            interaction.editReply(EmbedManager.set(interaction).load('embed-clan-management-home').modify(clanConfig.landing()).create());
        }
    }),


    'update-membercount': Schema.button
    ({
        meta: { id: 'button-clan-update-membercount' },

        flag:
        {
            defer:  false
        },

        load: function(interaction)
        {
            return Component
                .button (this.meta.id)
                .label  (`${Text.set('Update Member Count ').constrain(58, {align: 'center', paddingChar: '⠀'})}`)
                .style  ('Primary')
        },
    
        execute: async function (interaction) 
        {
            const { client: { registry }, member } = interaction;
        
            const modal = registry.modal.get('modal-clan-update-membercount');
            registry.modal.cache.set(member.id, interaction.customId);
        
            await interaction.showModal(modal.load());
        }
    }),
    
    'update-tag': Schema.button
    ({
        meta: { id: 'button-clan-update-tag' },

        flag:
        {
            defer:  false
        },

        load: function(interaction)
        {
            return Component
                .button (this.meta.id)
                .label  (`${Text.set('Update Clan Tag').constrain(58, {align: 'center', paddingChar: '⠀'})}`)
                .style  ('Primary')
        },
    
        execute: async function (interaction) 
        {
            const { client: { registry }, member } = interaction;
        
            const modal = registry.modal.get('modal-clan-update-tag');
            registry.modal.cache.set(member.id, interaction.customId);
        
            await interaction.showModal(modal.load());
        }
    }),

    'update-level': Schema.button
    ({
        meta: { id: 'button-clan-update-level' },

        flag:
        {
            defer:  false
        },

        load: function(interaction)
        {
            return Component
                .button (this.meta.id)
                .label  (`${Text.set('Update Clan Level ').constrain(59, {align: 'center', paddingChar: '⠀'})}`)
                .style  ('Primary')
        },
    
        execute: async function (interaction) 
        {
            const { client: { registry }, member } = interaction;
        
            const modal = registry.modal.get('modal-clan-update-level');
            registry.modal.cache.set(member.id, interaction.customId);
        
            await interaction.showModal(modal.load());
        }
    }),

    'update-leader': Schema.button
    ({
        meta: { id: 'button-clan-update-leader' },

        flag: 
        { 
            update: true
        },

        load: function(interaction)
        {
            return Component
                .button (this.meta.id)
                .label  (`${Text.set('Update Clan Leader').constrain(29, {align: 'center', paddingChar: '⠀'})}`)
                .style  ('Primary')
        },
    
        execute: async function (interaction) 
        {
            interaction.editReply(EmbedManager.set(interaction).load('embed-clan-management-home').modify(clanConfig.leader()).create());
        }
    }),

    'update-deputy': Schema.button
    ({
        meta: { id: 'button-clan-update-deputy' },

        flag: 
        { 
            update: true
        },

        load: function(interaction)
        {
            return Component
                .button (this.meta.id)
                .label  (`${Text.set('Update Clan Deputies ').constrain(31, {align: 'center', paddingChar: '⠀'})}`)
                .style  ('Primary')
        },
    
        execute: async function (interaction) 
        {
            interaction.editReply(EmbedManager.set(interaction).load('embed-clan-management-home').modify(clanConfig.deputy()).create());

        }
    }),


    'clan-update-clanboss-custom': Schema.button
    ({
        meta: { id: 'button-clan-update-clanboss-custom' },

        flag:
        {
            defer:  false
        },

        load: function(interaction)
        {
            return Component
                .button (this.meta.id)
                .label  (`${Text.set(' Create Custom Message ').constrain(60, {align: 'center', paddingChar: '⠀'})}`)
                .style  ('Primary')
        },
    
        execute: async function (interaction) 
        {
            const { client: { registry }, member } = interaction;
        
            const modal = registry.modal.get('modal-clan-update-clanboss-custom');
            registry.modal.cache.set(member.id, interaction.customId);
        
            await interaction.showModal(modal.load());
        }
    }),    
    
    'clan-update-hydra-custom': Schema.button
    ({
        meta: { id: 'button-clan-update-hydra-custom' },

        flag:
        {
            defer:  false
        },

        load: function(interaction)
        {
            return Component
                .button (this.meta.id)
                .label  (`${Text.set(' Create Custom Message ').constrain(60, {align: 'center', paddingChar: '⠀'})}`)
                .style  ('Primary')
        },

        execute: async function (interaction) 
        {
            const { client: { registry }, member } = interaction;
        
            const modal = registry.modal.get('modal-clan-update-hydra-custom');
            registry.modal.cache.set(member.id, interaction.customId);
        
            await interaction.showModal(modal.load());
        }
    }),    
    
    'clan-update-chimera-custom': Schema.button
    ({
        meta: { id: 'button-clan-update-chimera-custom' },

        flag:
        {
            defer:  false
        },

        load: function(interaction)
        {
            return Component
                .button (this.meta.id)
                .label  (`${Text.set(' Create Custom Message ').constrain(60, {align: 'center', paddingChar: '⠀'})}`)
                .style  ('Primary')
        },
    
        execute: async function (interaction) 
        {
            const { client: { registry }, member } = interaction;
        
            const modal = registry.modal.get('modal-clan-update-chimera-custom');
            registry.modal.cache.set(member.id, interaction.customId);
        
            await interaction.showModal(modal.load());
        }
    }),


    'clan-update-cvc-custom': Schema.button
    ({
        meta: { id: 'button-clan-update-cvc-custom' },

        flag:
        {
            defer:  false
        },

        load: function(interaction)
        {
            return Component
                .button (this.meta.id)
                .label  (`${Text.set(' Create Custom Message ').constrain(60, {align: 'center', paddingChar: '⠀'})}`)
                .style  ('Primary')
        },
    
        execute: async function (interaction) 
        {
            const { client: { registry }, member } = interaction;
        
            const modal = registry.modal.get('modal-clan-update-cvc-custom');
            registry.modal.cache.set(member.id, interaction.customId);
        
            await interaction.showModal(modal.load());
        }
    }),

    'clan-update-siege-custom': Schema.button
    ({
        meta: { id: 'button-clan-update-siege-custom' },

        flag:
        {
            defer:  false
        },

        load: function()
        {
            return Component
                .button (this.meta.id)
                .label  (`${Text.set(' Create Custom Message ').constrain(60, {align: 'center', paddingChar: '⠀'})}`)
                .style  ('Primary')
        },
    
        execute: async function (interaction) 
        {
            const { client: { registry }, member } = interaction;
        
            const modal = registry.modal.get('modal-clan-update-siege-custom');
            registry.modal.cache.set(member.id, interaction.customId);
        
            await interaction.showModal(modal.load());
        }
    }),

        'clan-update-recruitment-message': Schema.button
    ({
        meta: { id: 'button-clan-update-recruitment-message' },

        flag:
        {
            defer:  false
        },

        load: function(interaction)
        {
            return Component
                .button (this.meta.id)
                .label  (`${Text.set(' Create Custom Message ').constrain(60, {align: 'center', paddingChar: '⠀'})}`)
                .style  ('Primary')
        },
    
        execute: async function (interaction) 
        {
            const { client: { registry }, member } = interaction;
        
            const modal = registry.modal.get('modal-clan-update-recruitment-message');
            registry.modal.cache.set(member.id, interaction.customId);
        
            await interaction.showModal(modal.load());
        }
    }),
}

export default data