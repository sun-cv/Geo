import {Component, Schema, EmbedManager, Text, Flags } from '#utils';
import { move }                                 from '#utils/toolkit/embed-movement.js';
import { clanConfig }                           from '#commands/clan/config/clan.js';

const flag = Flags.from({ autoload: true })

const data = 
{
    'movement-up-small': Schema.button
    ({
        meta: { id: 'button-movement-up-small'},

        flag:
        {
            update: true,
        },

        load: function()
        {
            return Component
                .button(this.meta.id)
                .label(`${Text.set('↑').constrain(5, { paddingChar: '⠀', align: 'center'})}`)
                .style('Secondary')
        },

        execute: function(interaction)
        {
            const { member, client: { clanManagement: { cache: { selection } }} } = interaction;
            
            const newSelection = move(clanConfig.grid, selection.get(member.id), 'up');
            
            selection.set(member.id, newSelection)

            interaction.editReply(EmbedManager.set(interaction).load('embed-clan-management-home').modify(clanConfig.getModifier(selection.get(member.id))).create());
        }    
    }),
     
    'movement-down-small': Schema.button
    ({
        meta: { id: 'button-movement-down-small'},

        flag:
        {
            update: true,
        },

        load: function()
        {
            return Component
                .button(this.meta.id)
                .label(`${Text.set('↓').constrain(5, { paddingChar: '⠀', align: 'center'})}`)
                .style('Secondary')
        },
        
        execute: function(interaction)
        {
            const { member, client: { clanManagement: { cache: { selection } }} } = interaction;
            
            const newSelection = move(clanConfig.grid, selection.get(member.id), 'down');
            
            selection.set(member.id, newSelection)

            interaction.editReply(EmbedManager.set(interaction).load('embed-clan-management-home').modify(clanConfig.getModifier(selection.get(member.id))).create());
        }    
    }),
    
    'movement-left-small': Schema.button
    ({
        meta: { id: 'button-movement-left-small'},

        flag:
        {
            update: true,
        },

        load: function()
        {
            return Component
                .button(this.meta.id)
                .label(`${Text.set('←').constrain(5, { paddingChar: '⠀', align: 'center'})}`)
                .style('Secondary')
        },
        
        execute: function(interaction)
        {
            const { member, client: { clanManagement: { cache: { selection } }} } = interaction;
            
            const newSelection = move(clanConfig.grid, selection.get(member.id), 'left');
            
            selection.set(member.id, newSelection)

            interaction.editReply(EmbedManager.set(interaction).load('embed-clan-management-home').modify(clanConfig.getModifier(selection.get(member.id))).create());
        }    
    }),

    'movement-right-small': Schema.button
    ({
        meta: { id: 'button-movement-right-small'},

        flag:
        {
            update: true,
        },

        load: function()
        {
            return Component
                .button(this.meta.id)
                .label(`${Text.set('→').constrain(5, { paddingChar: '⠀', align: 'center'})}`)
                .style('Secondary')
        },
        execute: function(interaction)
        {
            const { member, client: { clanManagement: { cache: { selection } }} } = interaction;
            
            const newSelection = move(clanConfig.grid, selection.get(member.id), 'right');
            
            selection.set(member.id, newSelection)

            interaction.editReply(EmbedManager.set(interaction).load('embed-clan-management-home').modify(clanConfig.getModifier(selection.get(member.id))).create());
        }    
    })

}


export { flag }
export default data