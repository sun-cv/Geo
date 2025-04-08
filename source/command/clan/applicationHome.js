import { CommandInteraction,  SlashCommandBuilder } from "discord.js";
import { EmbedManager, Schema }    from '../../../utility/index.js'



async function applicationLanding(interaction = new CommandInteraction())
{
    const channel = await interaction.client.channels.fetch(interaction.client.clanManagement.applications.channel);
    channel.send(EmbedManager.set(interaction).load('embed-clan-application-landing').create())
}

const command = Schema.command
({
    meta: 
    {
        id:             "application_landing",
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
    	.setName('application_landing')
    	.setDescription('Create the Clan Application landing'),
        
    execute: applicationLanding
});

export default command;

