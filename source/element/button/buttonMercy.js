import { Component, Text, EmbedManager, Schema }    from "../../../utility/index.js";


const data = 
{

    'accounts-add-account': Schema.button
    ({
        meta: { id: 'button--accounts-add-account' },

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

    'accounts-select-account': Schema.button
    ({
        meta: { id: 'button-accounts-select-account' },

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
                data.row.push({ menu: ['menu-mercy-select-account'] });
            }
            interaction.editReply(EmbedManager.set(interaction).load('embed-mercy-account-landing').modify(modifier).create());
        }
    }),

    'accounts-delete-account': Schema.button
    ({
        meta: { id: 'button-accounts-delete-account' },

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

    'account-settings': Schema.button
    ({
        meta: { id: 'button-account-settings' },

        flag: 
        {
            update: true,
            navigation: true,
        },

        load:function(interaction)
        {
            return Component
                .button (this.meta.id)
                .label  (`${Text.set('settings').constrain(18, {align: 'center', paddingChar: '⠀'})}`)
                .style  ('Primary')
        },

        execute: async function (interaction) 
        {
            interaction.editReply(EmbedManager.set(interaction).load('embed-mercy-account-home').modify(modifier.settings).create());
        }
    }),

    'account-settings-prism': Schema.button
    ({
        meta: { id: 'button-account-settings-prism' },

        flag: 
        {
            update: true,
        },

        load:function(interaction)
        {
            return Component
                .button (this.meta.id)
                .label  (`${Text.set(' prism ').constrain(18, {align: 'center', paddingChar: '⠀'})}`)
                .style  ('Secondary')
        },

        execute: async function (interaction) 
        {
            const { mercy }         = interaction.client;
        
            const member            = mercy.initialize(interaction);
            const account           = member.account.getActive();

            account.settings.template.display.prism.toggle()
            account.update();

            interaction.editReply(EmbedManager.set(interaction).load('embed-mercy-account-home').modify(modifier.settings).create());
        }
    }),

    'account-settings-template': Schema.button
    ({
        meta: { id: 'button-account-settings-template' },

        flag: 
        {
            update: true,
        },

        load(interaction) 
        {
            const templates = ['static', 'rotate', 'random', 'custom', 'text'];

            const { mercy }       = interaction.client;
            const member          = mercy.initialize(interaction);
            const account         = member.account.getActive();
            const current         = account.settings.template.options.getActive() || 'static';
    
            const currentIndex    = templates.indexOf(current);
            const nextLabel       = templates[(currentIndex + 1) % templates.length];
    
            return Component
                .button(this.meta.id)
                .label(`${Text.set(`Enable: ${nextLabel}`).constrain(18, { align: 'center', paddingChar: '⠀' })}`)
                .style('Secondary');
        },
    
        async execute(interaction) 
        {
            const templates = ['static', 'rotate', 'random', 'custom', 'text'];

            const { mercy }       = interaction.client;
            const member          = mercy.initialize(interaction);
            const account         = member.account.getActive();
            const options         = account.settings.template.options;
    
            const current         = options.getActive() || 'static';
            const nextIndex       = (templates.indexOf(current) + 1) % templates.length;
            const nextMode        = templates[nextIndex];
    
            options[nextMode].set()
    
            account.update();

            interaction.editReply(EmbedManager.set(interaction).load('embed-mercy-account-home').modify(modifier.settings).create());
        }
    }),

    'account-tracking': Schema.button
    ({
        meta: { id: 'button-account-tracking' },

        flag: 
        {
            update: true,
            navigation: true,
        },

        load:function(interaction)
        {
            return Component
                .button (this.meta.id)
                .label  (`${Text.set('tracking ').constrain(17, {align: 'center', paddingChar: '⠀'})}`)
                .style  ('Primary')
        },

        execute: async function (interaction) 
        {
            interaction.editReply(EmbedManager.set(interaction).load('embed-mercy-account-home').modify(modifier.tracking).create());
        }
    }),

    'account-tracking-mercy': Schema.button
    ({
        meta: { id: 'button-account-tracking-mercy' },

        flag: 
        {
            update: true,
        },

        load:function(interaction)
        {
            return Component
                .button (this.meta.id)
                .label  (`${Text.set('mercy').constrain(19, {align: 'center', paddingChar: '⠀'})}`)
                .style  ('Secondary')
        },

        execute: async function (interaction) 
        {
            const { mercy }         = interaction.client;
        
            const member            = mercy.initialize(interaction);
            const account           = member.account.getActive();

            account.settings.template.display.mercy.toggle()
            account.update();

            interaction.editReply(EmbedManager.set(interaction).load('embed-mercy-account-home').modify(modifier.tracking).create());
        }
    }),
    
    'account-tracking-lifetime': Schema.button
    ({
        meta: { id: 'button-account-tracking-lifetime' },

        flag: 
        {
            update: true,
        },

        load:function(interaction)
        {
            return Component
                .button (this.meta.id)
                .label  (`${Text.set('lifetime').constrain(19, {align: 'center', paddingChar: '⠀'})}`)
                .style  ('Secondary')
        },

        execute: async function (interaction) 
        {
            const { mercy }         = interaction.client;
        
            const member            = mercy.initialize(interaction);
            const account           = member.account.getActive();

            account.settings.template.display.lifetime.toggle()
            account.update();

            interaction.editReply(EmbedManager.set(interaction).load('embed-mercy-account-home').modify(modifier.tracking).create());
        }
    }),    
    
    'account-tracking-session': Schema.button
    ({
        meta: { id: 'button-account-tracking-session' },

        flag: 
        {
            update: true,
        },

        load:function(interaction)
        {
            return Component
                .button (this.meta.id)
                .label  (`${Text.set('session').constrain(19, {align: 'center', paddingChar: '⠀'})}`)
                .style  ('Secondary')
        },

        execute: async function (interaction) 
        {
            const { mercy }         = interaction.client;
        
            const member            = mercy.initialize(interaction);
            const account           = member.account.getActive();

            account.settings.template.display.session.toggle()
            account.update();

            interaction.editReply(EmbedManager.set(interaction).load('embed-mercy-account-home').modify(modifier.tracking).create());
        }
    }),    
    
    'account-tracking-lastAdded': Schema.button
    ({
        meta: { id: 'button-account-tracking-lastAdded' },

        flag: 
        {
            update: true,
        },

        load:function(interaction)
        {
            return Component
                .button (this.meta.id)
                .label  (`${Text.set('last added').constrain(19, {align: 'center', paddingChar: '⠀'})}`)
                .style  ('Secondary')
        },

        execute: async function (interaction) 
        {
            const { mercy }         = interaction.client;
        
            const member            = mercy.initialize(interaction);
            const account           = member.account.getActive();

            account.settings.template.display.lastAdded.toggle()
            account.update();

            interaction.editReply(EmbedManager.set(interaction).load('embed-mercy-account-home').modify(modifier.tracking).create());
        }
    }),    
    
    'account-tracking-lastReset': Schema.button
    ({
        meta: { id: 'button-account-tracking-lastReset' },

        flag: 
        {
            update: true,
        },

        load:function(interaction)
        {
            return Component
                .button (this.meta.id)
                .label  (`${Text.set('last reset').constrain(19, {align: 'center', paddingChar: '⠀'})}`)
                .style  ('Secondary')
        },

        execute: async function (interaction) 
        {
            const { mercy }         = interaction.client;
        
            const member            = mercy.initialize(interaction);
            const account           = member.account.getActive();

            account.settings.template.display.lastReset.toggle()
            account.update();

            interaction.editReply(EmbedManager.set(interaction).load('embed-mercy-account-home').modify(modifier.tracking).create());
        }
    }),    
    
    'account-tracking-lastChampion': Schema.button
    ({
        meta: { id: 'button-account-tracking-lastChampion' },

        flag: 
        {
            update: true,
        },

        load:function(interaction)
        {
            return Component
                .button (this.meta.id)
                .label  (`${Text.set('last champion').constrain(19, {align: 'center', paddingChar: '⠀'})}`)
                .style  ('Secondary')
        },

        execute: async function (interaction) 
        {
            const { mercy }         = interaction.client;
        
            const member            = mercy.initialize(interaction);
            const account           = member.account.getActive();

            account.settings.template.display.lastChampion.toggle()
            account.update();

            interaction.editReply(EmbedManager.set(interaction).load('embed-mercy-account-home').modify(modifier.tracking).create());
        }
    }),




    'account-template': Schema.button
    ({
        meta: { id: 'button-account-template' },

        flag: 
        {
            update: true,
            navigation: true,
        },

        load:function(interaction)
        {
            return Component
                .button (this.meta.id)
                .label  (`${Text.set(' template ').constrain(19, {align: 'center', paddingChar: '⠀'})}`)
                .style  ('Primary')
        },

        execute: async function (interaction) 
        {
            interaction.editReply(EmbedManager.set(interaction).load('embed-mercy-account-home').modify(modifier.template).create());
        }
    }),

    'account-main': Schema.button
    ({
        meta: { id: 'button-account-main' },

        flag: 
        {
            update: true,
        },

        load:function(interaction)
        {
            return Component
                .button (this.meta.id)
                .label  (`${Text.set(`Make Main`).constrain(17, {align: 'center', paddingChar: '⠀'})}`)
                .style  ('Secondary')
        },

        execute: async function (interaction) 
        {
            const { mercy }         = interaction.client;
        
            const member            = mercy.initialize(interaction);
            const account           = member.account.getActive();

            for (const [name, cache] of member.account.cache)
            {
                cache.main = false;
                cache.update();
            }

            account.main = true
            account.update()

            interaction.editReply(EmbedManager.set(interaction).load('embed-mercy-account-home').modify(modifier.template).create());
        },
    }),

    'account-name': Schema.button
    ({
        meta: { id: 'button-account-name' },

        flag: 
        {
            defer: false
        },

        load:function(interaction)
        {
            return Component
                .button (this.meta.id)
                .label  (`${Text.set('Change name').constrain(16, {align: 'center', paddingChar: '⠀'})}`)
                .style  ('Secondary')
        },

        execute: async function (interaction) 
        {
            const { client: { registry }, member } = interaction;
            const modal = registry.modal.get('modal-mercy-account-name');
            registry.modal.cache.set(member.id, interaction.customId);
            await interaction.showModal(modal.load());
        }
    }),
    
}

export default data;

const modifier =
{
    settings: (data) => 
        {
            data.row.pop()
            data.row.push({ button:['button-account-settings-prism', 'button-account-settings-template', 'button-back-small'] });
        },
    tracking:(data) => 
        {
            data.row = [];
            data.row.push
            (
                { button:['button-account-settings-mercy', 'button-account-settings-lifetime', 'button-account-settings-session'] },
                { button:['button-account-settings-lastAdded', 'button-account-settings-lastReset', 'button-account-settings-lastChampion'] },
                { button:['button-back-small']}
            );
        },
    template:(data) => 
        {
            data.row.pop()
            // data.row.push({ button:['button-account-settings-prism', 'button-account-settings-template'] });
        }
}