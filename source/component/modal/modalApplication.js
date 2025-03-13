import { MessageFlags, TextInputStyle } from "discord.js";
import { Component, EmbedManager, Input, navigate, Schema } from "../../../utility/index.js";

const data = 
{

    'application-apply-name': Schema.modal
    ({
        meta: { id: `modal-application-apply-name` },

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
            interaction.followUp(EmbedManager.set(interaction).load('embed-application-apply-home').create());
        }
    }),
    

}


export default data