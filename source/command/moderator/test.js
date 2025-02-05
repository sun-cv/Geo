import { SlashCommandBuilder, CommandInteraction } from 'discord.js'



async function testCommand(interaction = new CommandInteraction()) 
{
    console.log("Test command used");
}


const command = {
    meta: 
    {
        id:             "test",
        type:           "command",
        description:    "this is a test command",
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
		.setName('test')
		.setDescription('test command'),
	execute: testCommand,
};

export default command;

