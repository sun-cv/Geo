import { CommandInteraction } from "discord.js";
import { Input } from "../../../utility/toolkit/input";


async function pull(interaction = new CommandInteraction())
{
    const { mercy }                 = interaction.client
    const { shard, count, name }    = Input.initialize(interaction);

    
    const member    = mercy.initialize(interaction);
    const account   = member.getAccount(name);

    if  (!account) 
    {
        return;
    }
    
    if (shard == 'primal')  account.mercy[shard].mythical.count  += count;
                            account.mercy[shard].legendary.count += count;

    const output = `<@${interaction.user.id}> pulled ${count} ${shardEmojis[shard]}`;

    


}

const command = {
    meta: 
    {
        id:             "pull",
        type:           "command",
        description:    "Mercy tracker pull command - adds shard input to current mercy count",
    },

    permission: 
    {
        cooldown:       0,
        access:         [],
        require:
        {
            active:     false,
            channels:   [],
            roles:      [],
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
        maintenance:    false
    },

    roleAssignment:     {},

    data: new SlashCommandBuilder()
    .setName('test')
    .setDescription('Command for testing purposes.'),

    execute: pull
};

export default command;