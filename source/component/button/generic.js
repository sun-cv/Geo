import { navigate, Component, Text, Schema } from "../../../utility/index.js"



const data = 
{
    'back-small-single': Schema.button
    ({
        meta: { id: 'button-back-small-single' },

        flag: 
        {
            update:     true,
        },

        load: function()
        {
            return Component
                .button (this.meta.id)
                .label  (`${Text.set(' back').constrain(17, {align: 'center', paddingChar: '⠀'})}`)
                .style  ('Secondary')
        },

        execute: (interaction) =>
        {
            navigate.member(interaction.member).back(interaction);
        }
    }),


    'blank-small-single': Schema.button
    ({
    meta: { id: 'button-blank-small-single' },

    flag: 
    {
        update:     true,
    },

    load: function()
    {
        return Component
            .button (this.meta.id)
            .label  (`${Text.set(' ').constrain(16, {align: 'center', paddingChar: '⠀'})}`)
            .style  ('Secondary')
    },

    execute: (interaction) =>
    {
    }

    }),


    'blank-small-four': Schema.button
    ({
    meta: { id: 'button-blank-small-four' },

    flag: 
    {
        update:     true,
    },

    load: function()
    {
        return Component
            .button (this.meta.id)
            .label  (`${Text.set(' ').constrain(37, {align: 'center', paddingChar: '⠀'})}`)
            .style  ('Secondary')
    },

    execute: (interaction) =>
    {
    }

    }),



}

export default data