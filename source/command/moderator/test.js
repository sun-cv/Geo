import { SlashCommandBuilder, CommandInteraction } from 'discord.js'
import { RoleAssignment } from '../../interaction/handler/role.js';
import Shards from '../mercy/tracker/shards.json' with { type: 'json' }

async function testCommand(interaction = new CommandInteraction()) 
{
    const { mercy } = interaction.client;

    const member    = mercy.initialize(interaction);
    const account   = member.getAccount('main');

    // interaction.data.roleAssignment[member.id] = new RoleAssignment();

    // interaction.data.roleAssignment[member.id].remove.push('Moderator', 'Mercy')

}

const command = {
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
        maintenance:    false
    },

    roleAssignment:     {},

    data: new SlashCommandBuilder()
    .setName('test')
    .setDescription('Command for testing purposes.'),

    execute: testCommand
};

export default command;