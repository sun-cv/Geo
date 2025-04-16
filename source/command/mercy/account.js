import { CommandInteraction, SlashCommandBuilder }  from "discord.js";
import { EmbedManager, Schema }                             from '../../../utility/index.js'

async function accountLanding(interaction = new CommandInteraction())
{ 

    interaction.editReply(EmbedManager.set(interaction).load('embed-mercy-account-landing').create());
    interaction.editReply(EmbedManager.set(interaction).load('embed-mercy-account-landing').create());


}

const command = Schema.command
({
    meta: 
    {
        id:             "account",
        type:           "command",
        description:    "Mercy Tracker account command - Entry point for Mercy Tracker account management",
    },

    permission: 
    {
        cooldown:       0,
        access:         [],
        require:
        {
            active:     false,
            channels:   [],
            roles:      [],
        },
        exclude:
        {
            active:     false,
            channels:   [],
            roles:      []
        }
    },

    flag: 
    {
        handled:        false,
        ignore:         false,
        defer:          true,
        ephemeral:      true,
        access:         false,
        maintenance:    false,
        autocomplete:   true,
        navigation:     true,
    },

    roleAssignment:     {},

	data: new SlashCommandBuilder()
		.setName('account')
		.setDescription('Manage Mercy Tracker accounts'),
    execute: accountLanding
});


export default command