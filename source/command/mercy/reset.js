import { CommandInteraction, MessageFlags, SlashCommandBuilder } from "discord.js";
import { Input }    from '../../../utility/index.js'
import message      from '../mercy/tracker/message.js'

async function reset(interaction = new CommandInteraction())
{
    const { mercy }                         = interaction.client
    const input                             = Input.initialize(interaction);
    const { champion, count, account_name } = input;
    
    const [shard, rarity = 'legendary']     = input.shard.split('.');
    
    const member                            = mercy.initialize(interaction);
    const account                           = member.getAccount(account_name);

    if  (!account) 
    {
        return interaction.followUp({ content: message.error.account.notFound(account_name), flags: MessageFlags.Ephemeral})
    }
    
    if (count)
    {
        account.pull(shard, count); // Optionally updates pull count for accurate record keeping before reset.
    }

    account.reset(shard, rarity, champion);

    interaction.followUp({ content: message.reset(member, account.session.lastChampion())})

    mercy.update(member);
    
}


const command = 
{
    meta: 
    {
        id:             "reset",
        type:           "command",
        description:    "Mercy tracker reset command - resets shard mercy count and logs champion pull",
    },

    permission: 
    {
        cooldown:       30,
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
        maintenance:    false,
        autocomplete:   true,
    },

    roleAssignment:     {},

    data: new SlashCommandBuilder()
    .setName('reset')
    .setDescription('Reset shard mercy and log your pull!')
    .addStringOption(option =>
        option.setName('shard')
            .setDescription('Shard type to reset')
            .setRequired(true)
            .addChoices(
                { name: 'ancient',          value: 'ancient'            },
                { name: 'void',             value: 'void'               },
                { name: 'primal legendary', value: 'primal.legendary'   },
                { name: 'primal mythical',  value: 'primal.mythical'    },
                { name: 'sacred',           value: 'sacred'             },
                { name: 'prism',            value: 'prism'              }
            ))
    .addStringOption(option =>
		option.setName('champion')
			.setDescription('Record your champion pull')
			.setRequired(true)
			.setAutocomplete(true))
    .addStringOption(option =>
        option.setName('account_name')
            .setDescription('Specify alternate account (if not \'main\')')
            .setRequired(false)
            .setAutocomplete(true))
    .addIntegerOption(option =>
        option.setName('count')
            .setDescription('Adjust mercy before reset')
            .setRequired(false)
            .setMinValue(-999)
            .setMaxValue(999)),

    execute: reset
};

export default command;