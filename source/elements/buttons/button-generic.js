import { navigate, Component, Text, Schema, Flags } from '#utils'


const flag = Flags.from({ autoload: true })

const data = 
{
    'back-small': Schema.button
    ({
        meta: { id: 'button-back-small' },

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


}


export { flag }
export default data