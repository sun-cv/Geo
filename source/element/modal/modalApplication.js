import { MessageFlags, TextInputStyle }                     from "discord.js";
import { Component, EmbedManager, Input, navigate, Schema } from "../../../utility/index.js";
import { applicationConfig }                                from "../../data/config/application.js";

const data = 
{

    'application-apply-name': Schema.modal
    ({
        meta: { id: `modal-application-apply-name` },

        flag:
        {
            update:             true,
        },

        load: function(interaction)
        {
            return Component
                .modal  (this.meta.id)
                .title  ('Application')
                .addTextInput('account_name', 'Enter your account name:', TextInputStyle.Short, true)
                .build();
        },

        execute: function(interaction) 
        {
            const { member, client: { clanManagement: { applications }} } = interaction;
    
            const { account_name }  = Input.modal(interaction);
            applications.createApplication(member, account_name);

            interaction.followUp(EmbedManager.set(interaction).load('embed-application-apply-home').create());
        }
    }),
   

    'application-transfer-name': Schema.modal
    ({
        meta: { id: `modal-application-transfer-name` },

        flag:
        {
            update:             true,
        },

        load: function(interaction)
        {
            return Component
                .modal  (this.meta.id)
                .title  ('Transfer')
                .addTextInput('account_name', 'Enter your account name:', TextInputStyle.Short, true)
                .build();
        },

        execute: function(interaction) 
        {
            const { member, client: { clanManagement: { applications }} } = interaction;
    
            const { account_name }  = Input.modal(interaction);
            applications.createTransferNoRecord(member, account_name);

            interaction.followUp(EmbedManager.set(interaction).load('embed-application-apply-home').create());
        }
    }),


    
    'application-apply-message': Schema.modal
    ({
        meta: { id: `modal-application-apply-message` },

        flag: 
        {
            update: true,
        },

        load: function(interaction)
        {
            return Component
                .modal  (this.meta.id)
                .title  ('Message')
                .addTextInput('message', 'Please leave a message:', TextInputStyle.Paragraph, true)
                .build();
        },

        execute: function(interaction) 
        {
            const { member, client: { clanManagement: { applications }} } = interaction;
            const { message }   = Input.modal(interaction);
            
            const application           = applications.getApplication(member);

            application.data.message    = message;
            application.meta.location   = (application.meta.location + 1) % applicationConfig.selection.count;          
            
            interaction.editReply(EmbedManager.set(interaction).load('embed-application-apply-home').modify(getModifier(application)).create());
        }
    }),

}


function getModifier(application)
{

    if (application.meta.location == 9)
        {                
            return (data) => 
            {    
                data.row.pop()
                data.row[0].button[1] = 'button-application-message';
            }
        }
            
    if (application.meta.location == 10)
    {
         return (data) => 
        {    
            data.row.pop()
            data.row[0].button[1] = 'button-application-submit';
        }
    }
            
        return (data) => 
        {
            data.row.pop()
            data.row.push({menu: applicationConfig.menu.load[application.meta.location]});
        }
}


export default data