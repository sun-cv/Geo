import { CommandInteraction, MessageFlags, SlashCommandBuilder } from "discord.js";
import { EmbedManager, Input, navigate }    from '../../../utility/index.js'
import message      from '../mercy/tracker/message.js'

async function accountLanding(interaction = new CommandInteraction())
{ 

    interaction.editReply(EmbedManager.set(interaction).load('mercy-account-landing'));

}

const command = 
{
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
};

export default command;