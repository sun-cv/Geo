import { SlashCommandBuilder, CommandInteraction } from 'discord.js'

async function cleanCommand(interaction = new CommandInteraction()) {

	const count = interaction.options.getInteger('count');

	const messages = await interaction.channel.messages.fetch({ limit: count });

	const deletedMessages = await interaction.channel.bulkDelete(messages)

    console.log(deletedMessages)

	interaction.editReply({ content : `Deleted ${deletedMessages.size} messages!`, ephemeral : true });
}

const command = {
    
    meta: 
    {
        id:             "clean",
        type:           "command",
        description:    "Removes the last x number of messages in the channel.",
    },

    access: 
    {
        cooldown:       0,
        permissions:    [],
        channels:       [],
        roles:          ["moderator"],
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
};

export default command;
