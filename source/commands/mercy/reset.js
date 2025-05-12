import { CommandInteraction, MessageFlags, SlashCommandBuilder }    from 'discord.js';
import { Input, Schema }                                            from '#utils'
import { error }                                                    from "#resources/templates/template-generic.js";
import { template }                                                 from "#resources/templates/template-mercy.js";

async function reset(interaction = new CommandInteraction())
{
    const { mercy }                         = interaction.client
    const input                             = Input.command(interaction);
    const { champion, count, account_name } = input;
    
    const [shard, rarity = 'legendary']     = input.shard.split('.');
    
    const member                            = mercy.initialize(interaction);
    const account                           = member.account.get(account_name)

    if  (!account) 
    {
        await interaction.followUp({ content: error.account.notFound(account_name), flags: MessageFlags.Ephemeral})
        return;
    }
    
    if (count)
    {
        account.pull(shard, count); // Optionally updates pull count for accurate record keeping before reset.
    }

    account.reset(shard, rarity, champion);
    account.update();    
    
    await interaction.followUp({ content: `${template.command.reset.pull(interaction)}${template.command.reset.chance(interaction)}`})
}


const command = Schema.command
({
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
            channels:   [],
            roles:      [],
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
        ephemeral:      false,

        permission:     false,
        require:        false,
        exclude:        false,

        maintenance:    false,
        autocomplete:   true,
        navigation:     false,
        
        handled:        false,
        autoload:       true,
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
});


export default command