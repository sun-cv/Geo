import { SlashCommandBuilder, CommandInteraction }  from 'discord.js'
import { Schema }                                   from '#utils';

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
            channels:   [],
            roles:      ["Moderator"],
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

        permission:     true,
        require:        true,
        exclude:        false,

        maintenance:    false,
        autocomplete:   false,
        navigation:     false,
        
        handled:        false,
        ignore:         false,
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