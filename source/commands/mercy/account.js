import { CommandInteraction, SlashCommandBuilder }  from 'discord.js';
import { EmbedManager, Schema }                     from '#utils'

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
            channels:   [],
            roles:      [],
        },
        exclude:
        {
            channels:   [],
            roles:      []
        }
    },

    flag: 
    {
        defer:          true,
        update:         false,
        ephemeral:      true,

        permission:     false,
        require:        false,
        exclude:        false,

        maintenance:    false,
        autocomplete:   true,
        navigation:     true,
        
        handled:        false,
        ignore:         false,
    },

    roleAssignment:     {},

	data: new SlashCommandBuilder()
		.setName('account')
		.setDescription('Manage Mercy Tracker accounts'),
    execute: accountLanding
});


export default command