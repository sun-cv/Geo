import { CommandInteraction, MessageFlags, SlashCommandBuilder } from "discord.js";
import { EmbedManager, Input, Schema }    from '../../../utility/index.js'



async function clanManagement(interaction = new CommandInteraction())
{
    interaction.editReply(EmbedManager.set(interaction).load('embed-clan-home').create())
}

const command = Schema.command
({
    meta: 
    {
        id:             "clan",
        type:           "command",
        description:    "Clan management system",
    },

    permission: 
    {
        cooldown:       0,
        access:         [],
        require:
        {
            active:     true,
            channels:   [],
            roles:      ['Moderator'],
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
        defer:          true,
        update:         false,
        ephemeral:      true,
        permission:     false,
        maintenance:    false,
        autocomplete:   false,
        navigation:     true,
        
        handled:        false,
        ignore:         false,
    },

    roleAssignment:     {},

    data: new SlashCommandBuilder()
    	.setName('clan')
    	.setDescription('Access the clan management system'),
        
    execute: clanManagement
});

export default command;

