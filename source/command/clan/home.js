import { CommandInteraction, MessageFlags, SlashCommandBuilder } from "discord.js";
import { EmbedManager, Input, Schema }    from '../../../utility/index.js'



async function clanHome(interaction = new CommandInteraction())
{
    interaction.editReply(EmbedManager.set(interaction).load('embed-clan-home').create())
}

const command = Schema.command
({
    meta: 
    {
        id:             "clanhome",
        type:           "command",
        description:    "Creates Clan Applications home embed",
    },

    permission: 
    {
        cooldown:       0,
        access:         [],
        require:
        {
            active:     true,
            channels:   ['test'],
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
        handled:        false,
        ignore:         false,
        defer:          true,
        ephemeral:      false,
        access:         false,
        maintenance:    false,
        autocomplete:   false,
    },

    roleAssignment:     {},

    data: new SlashCommandBuilder()
    	.setName('clanhome')
    	.setDescription('Create the Clan Application Home'),
        
    execute: clanHome
});

export default command;

