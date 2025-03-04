import { SlashCommandBuilder, CommandInteraction } from 'discord.js'
import { Schema } from '../../../utility/index.js';

async function testCommand(interaction = new CommandInteraction()) 
{
    const { mercy } = interaction.client;

    const member    = mercy.initialize(interaction);
    const account   = member.getAccount('main');

    // interaction.data.roleAssignment[member.id] = new RoleAssignment();

    // interaction.data.roleAssignment[member.id].remove.push('Moderator', 'Mercy')

}

const command = Schema.command
({
    meta: 
    {
        id:             "test",
        type:           "command",
        description:    "Command for testing purposes.",
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
        handled:        false,
        ignore:         false,
        defer:          true,
        ephemeral:      true,
        access:         true,
        maintenance:    false,
        autocomplete:   true,
    },

    roleAssignment:     {},
    
    data: new SlashCommandBuilder()
    .setName('test')
    .setDescription('Command for testing purposes.')
    		.addStringOption(option =>
    		option.setName('testing')
    			.setDescription('Specify an alt account to pull shards')
    			.setAutocomplete(true))
            .addStringOption(option =>
    		option.setName('testing2')
    			.setDescription('test')
    			.setAutocomplete(true)),
    execute: testCommand
});


export default command