import { CommandInteraction, MessageFlags, SlashCommandBuilder }    from 'discord.js';
import { Input, Schema }                                            from '#utils'
import { error }                                                    from '#resources/templates/template-generic.js'
import { template }                                                 from "#resources/templates/template-mercy.js";

async function pull(interaction = new CommandInteraction())
{
    
    const { mercy }                     = interaction.client
    const { shard, count, account_name} = Input.command(interaction);
  
    const member                        = mercy.initialize(interaction);
    const account                       = member.account.get(account_name);

    if  (!account) 
    {
        await interaction.followUp({ content: error.account.notFound(account_name), flags: MessageFlags.Ephemeral})
        return;
    }
   
    account.pull(shard, count);
    account.update();
 
    await interaction.followUp({ content: template.command.pull(interaction)});
}

const command = Schema.command
({
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
    	.setName('pull')
    	.setDescription('Track and log shard pulls')
        .addIntegerOption(option =>
            option.setName('count')
                .setDescription('Number of shards to pull')
                .setRequired(true)
                .setMinValue(-999)
                .setMaxValue(999))
        .addStringOption(option =>
            option.setName('shard')
                .setDescription('Shard type to pull')
                .setRequired(true)
                .addChoices(
                    { name: 'ancient',  value: 'ancient'},
                    { name: 'void',     value: 'void'   },
                    { name: 'primal',   value: 'primal' },
                    { name: 'sacred',   value: 'sacred' },
                    { name: 'prism',    value: 'prism'  },
                ))
    	.addStringOption(option =>
    		option.setName('account_name')
    			.setDescription('Specify alternate account (if not \'main\')')
    			.setAutocomplete(true),
    	),
        
    execute: pull
});

export default command;

