import { Component, Text, EmbedManager, Schema }    from "../../../utility/index.js";


const data = 
{
    'home-profile': Schema.button
    ({
        meta: { id: 'button-mercy-home-profile' },

        flag: 
        {
            update:     true,
            navigation: true,
        },

        load: function()
        {
            return Component
                .button (this.meta.id)
                .label  (`${Text.set('Profile').constrain(18, {align: 'center', paddingChar: '⠀'})}`)
                .style  ('Primary')
        },

        execute: () => {}
    }),

    'home-accounts': Schema.button
    ({
        meta: { id: 'button-mercy-home-accounts' },

        flag: 
        {
            update:     true,
            navigation: true,
        },

        load: function()
        {
            return Component
                .button (this.meta.id)
                .label  (`${Text.set('Accounts').constrain(17, {align: 'center', paddingChar: '⠀'})}`)
                .style  ('Primary')
        },
    
        execute: (interaction) => 
        {
            interaction.editReply(EmbedManager.set(interaction).load('embed-mercy-accounts-home').create());
        }
    }),

    'home-data': Schema.button
    ({
        meta: { id: 'button-mercy-home-data' },

        flag: 
        {
            update:     true,
            navigation: true,
        },

        load: function()
        {
            return Component
                .button (this.meta.id)
                .label  (`${Text.set('Data').constrain(15, {align: 'center', paddingChar: '⠀'})}`)
                .style  ('Primary')
        },
    
        execute: () => {}
    }),


    'accounts-add': Schema.button
    ({
        meta: { id: 'button-mercy-accounts-add' },

        flag:
        {
            defer:  false
        },

        load: function(interaction)
        {
            return Component
                .button (this.meta.id)
                .label  (`${Text.set('Add account').constrain(18, {align: 'center', paddingChar: '⠀'})}`)
                .style  ('Primary')
        },
    
        execute: async function (interaction) 
        {
            const { client: { registry }, member } = interaction;
        
            const modal = registry.modal.get('modal-mercy-account-add');
            registry.modal.cache.set(member.id, interaction.customId);
        
            await interaction.showModal(modal.load());
        }
    }),

    'accounts-select': Schema.button
    ({
        meta: { id: 'button-mercy-accounts-select' },

        flag: 
        {
            update: true,
        },

        load: function(interaction)
        {
            return Component
                .button (this.meta.id)
                .label  (`${Text.set('Select account').constrain(19, {align: 'center', paddingChar: '⠀'})}`)
                .style  ('Primary')
        },
    
        execute: async function (interaction) 
        {
            const modifier = (data) => 
                {
                    data.row.pop()
                    data.row.push({menu: 'menu-mercy-select-account'});
                }
            interaction.editReply(EmbedManager.set(interaction).load('embed-mercy-accounts-home').modify(modifier).create());
        }
    }),

    'accounts-delete': Schema.button
    ({
        meta: { id: 'button-mercy-accounts-delete' },

        flag: 
        {
            defer: false
        },

        load:function(interaction)
        {
            return Component
                .button (this.meta.id)
                .label  (`${Text.set('Delete').constrain(16, {align: 'center', paddingChar: '⠀'})}`)
                .style  ('Danger')
        },

        execute: async function (interaction) 
        {
            const { client: { registry }, member } = interaction;
            const modal = registry.modal.get('modal-mercy-account-delete');
            registry.modal.cache.set(member.id, interaction.customId);
            await interaction.showModal(modal.load());
        }
    }),
}

export default data;