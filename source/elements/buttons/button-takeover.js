import { Component, Text, EmbedManager, Schema, Timestamp, Flags }  from '#utils';
import { channel }                      from '#commands/moderator/takeover.js'


const flag = Flags.from({ autoload: true })

const data = 
{
    'takeover-request': Schema.button
    ({
        meta: { id: 'button-takeover-request' },

        flag: 
        {
            update:     true,
        },

        load: function()
        {
            return Component
                .button (this.meta.id)
                .label  (`${Text.set('Request Takeover').constrain(58, {align: 'center', paddingChar: '⠀'})}`)
                .style  ('Primary')
        },

        execute: async (interaction) =>
        {
            const { client: { registry: { channels }}} = interaction;
                
            let channelid = await channels.get(channel.landing);
            let messages  = await channelid.messages.fetch()
            let message   = messages.first()

            message.edit(EmbedManager.set(interaction).load('embed-takeover-landing').create())
                
            channelid = await channels.get(channel.moderator);
            messages  = await channelid.messages.fetch()
            message   = messages.first()

            message.edit(EmbedManager.set(interaction).load('embed-takeover-moderator').create())            
        }
    }),

    'takeover-accept': Schema.button
    ({
        meta: { id: 'button-takeover-accept' },

        flag: 
        {
            update:     true,
        },

        load: function()
        {
            return Component
                .button (this.meta.id)
                .label  (`${Text.set('Accept').constrain(12, {align: 'center', paddingChar: '⠀'})}`)
                .style  ('Success')
        },

        execute: async (interaction) =>
        {
            const { client: { registry: {channels }}} = interaction;
                
            let channelid = await channels.get(channel.landing);
            let messages  = await channelid.messages.fetch()
            let message   = messages.first()

            message.edit(EmbedManager.set(interaction).load('embed-takeover-landing').create())
                
            channelid = await channels.get(channel.moderator);
            messages  = await channelid.messages.fetch()
            message   = messages.first()

            message.edit(EmbedManager.set(interaction).load('embed-takeover-moderator').create())            
        }
    }),

    'takeover-decline': Schema.button
    ({
        meta: { id: 'button-takeover-decline' },

        flag: 
        {
            update:     true,
        },

        load: function()
        {
            return Component
                .button (this.meta.id)
                .label  (`${Text.set('Decline').constrain(12, {align: 'center', paddingChar: '⠀'})}`)
                .style  ('Danger')
        },

        execute: async (interaction) =>
        {
            const { client: { registry: {channels }}} = interaction;
                
            let channelid = await channels.get(channel.landing);
            let messages  = await channelid.messages.fetch()
            let message   = messages.first()

            message.edit(EmbedManager.set(interaction).load('embed-takeover-landing').create())
                
            channelid = await channels.get(channel.moderator);
            messages  = await channelid.messages.fetch()
            message   = messages.first()

            message.edit(EmbedManager.set(interaction).load('embed-takeover-moderator').create())            
        }
    }),


    'takeover-complete': Schema.button
    ({
        meta: { id: 'button-takeover-complete' },

        flag: 
        {
            update:     true,
        },

        load: function()
        {
            return Component
                .button (this.meta.id)
                .label  (`${Text.set('Complete').constrain(12, {align: 'center', paddingChar: '⠀'})}`)
                .style  ('Primary')
        },

        execute: async (interaction) =>
        {
            const { client: { registry: {channels }}} = interaction;
                
            let channelid = await channels.get(channel.landing);
            let messages  = await channelid.messages.fetch()
            let message   = messages.first()

            message.edit(EmbedManager.set(interaction).load('embed-takeover-landing').create())
                
            channelid = await channels.get(channel.moderator);
            messages  = await channelid.messages.fetch()
            message   = messages.first()

            message.edit(EmbedManager.set(interaction).load('embed-takeover-moderator').create())            
        }
    }),

    'takeover-refresh': Schema.button
    ({
        meta: { id: 'button-takeover-refresh' },

        flag: 
        {
            update:     true,
        },

        load: function()
        {
            return Component
                .button (this.meta.id)
                .label  (`${Text.set('Refresh').constrain(12, {align: 'center', paddingChar: '⠀'})}`)
                .style  ('Secondary')
        },

        execute: async (interaction) =>
        {
            const { client: { registry: { channels, filter }}} = interaction;
                
            const channelid = channels.get(channel.moderator);
            const message   = channelid.messages.cache.first()
            
            filter.takeover[interaction.user.id] = null;

            message.edit(EmbedManager.set(interaction).load('embed-takeover-moderator').create())            
        }
    }),


}


export { flag }
export default data