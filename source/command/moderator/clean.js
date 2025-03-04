import { SlashCommandBuilder, CommandInteraction } from 'discord.js'
import { Schema } from '../../../utility/index.js';

async function cleanCommand(interaction = new CommandInteraction()) {

	const count = interaction.options.getInteger('count');

	const messages = await interaction.channel.messages.fetch({ limit: count });

	const deletedMessages = await interaction.channel.bulkDelete(messages)

	await interaction.editReply({ content : `Deleted ${deletedMessages.size} messages!`, ephemeral : true });
}


const command = Schema.command
({
    meta: 
    {
        id:             "clean",
        type:           "command",
        description:    "Removes the last x number of messages in the channel.",
    },

    permission: 
    {
        cooldown:       0,
        access:         [],
        require:
        {
            active:     true,
            channels:   [],
            roles:      ["moderator"],
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
        ignore:         false,
        defer:          true,
        maintenance:    false
    },

    data: new SlashCommandBuilder()
    	.setName('clean')
    	.setDescription('Removes the last x number of messages in the channel.')
    	.addIntegerOption(option =>
    		option.setName('count')
    			.setDescription('Number of messages to delete')
    			.setRequired(true)
    			.setMinValue(0)
    			.setMaxValue(100)),
    execute: cleanCommand,
});


export default command