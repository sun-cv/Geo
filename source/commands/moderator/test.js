import { SlashCommandBuilder, CommandInteraction }  from 'discord.js'
import { Schema }                                   from '#utils';

async function testCommand(interaction = new CommandInteraction()) 
{


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
            channels:   [],
            roles:      ['moderator'],
        },
        exclude:
        {
            channels:   [],
            roles:      []
        }
    },

    flag: 
    {
        defer:          false,
        update:         false,
        ephemeral:      true,

        permission:     true,
        require:        true,
        exclude:        false,

        maintenance:    false,
        autocomplete:   true,
        navigation:     false,
        
        handled:        false,
        ignore:         false,
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