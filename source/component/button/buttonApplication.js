import { Component, Text, EmbedManager, Schema }    from "../../../utility/index.js";
import { applicationData }                          from "../../data/application/data.js";

const data = 
{
    'application-apply': Schema.button
    ({
        meta: { id: 'button-application-apply' },

        flag: 
        {
            defer: false,
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
            const { client: { registry }, member } = interaction;
        
            const modal = registry.modal.get('modal-application-apply-name');
            registry.modal.cache.set(member.id, interaction.customId);
        
            await interaction.showModal(modal.load());
        }
    }),

    'application-transfer': Schema.button
    ({
        meta: { id: 'button-application-transfer' },

        load: function()
        {
            return Component
                .button (this.meta.id)
                .label  (`${Text.set('Transfer').constrain(27, {align: 'center', paddingChar: '⠀'})}`)
                .style  ('Primary')
        },

        execute: () => {}
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
            const { member, client: { clanCluster: { applications }} } = interaction;
            const application = applications.getApplication(member);

            application.meta.location = (application.meta.location - 1 + 9) % 9;

            const modifier = (data) => 
                {
                    data.row.pop()
                    data.row.push({menu: applicationData(interaction).menu[application.meta.location]});
                }
            interaction.editReply(EmbedManager.set(interaction).load('embed-application-apply-home').modify(modifier).create());

        }


    }),

    'application-message': Schema.button
    ({
        meta: { id: 'button-application-message'},
        load: function(interaction)
        {

            const { member, client: { clanCluster: { applications }} } = interaction;
            const application = applications.getApplication(member);

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
            const { member, client: { clanCluster: { applications }} } = interaction;
            const application = applications.getApplication(member);

            application.meta.location = (application.meta.location + 1) % 9;

            const modifier = (data) => 
                {
                    data.row.pop()
                    data.row.push({menu: applicationData(interaction).menu[application.meta.location]});
                }
            interaction.editReply(EmbedManager.set(interaction).load('embed-application-apply-home').modify(modifier).create());
        }
    
    })
}


export default data;