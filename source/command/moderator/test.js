import { SlashCommandBuilder, CommandInteraction } from 'discord.js'
import { log } from '../../../utility/index.js'


async function testCommand(interaction = new CommandInteraction()) 
{
    interaction.editReply({content: "test"})
    log.event("Test command used");
}


const command = {
    meta: 
    {
        id:             "test",
        type:           "command",
        description:    "this is a test command",
    },

    permission: 
    {
        access:         [],
        require:
        {
            active:     true,
            channels:   [],
            roles:      ["Moderator"],
        },
        exclude:
        {
            active:     true,
            channels:   ["test"],
            roles:      []
        },
        cooldown: 
        {
            command:    120,
            share:      120,
        }
    },

    flag: 
    {
        handled:        false,
        ignore:         false,
        defer:          false,
        permission:     true,
        cooldown:       true,
        maintenance:    false
    },

	data: new SlashCommandBuilder()
		.setName('test')
		.setDescription('test command')
        		.addStringOption(option =>
			option.setName('share')
				.setDescription('Sharing test')
				.addChoices(
					{ name: 'true', value: 'true' })),

	execute: testCommand,
};

export default command;

