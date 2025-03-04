import { CommandInteraction, MessageFlags, SlashCommandBuilder } from "discord.js";
import { Input, Schema }    from '../../../utility/index.js'
import message      from '../mercy/tracker/message.js'

async function pull(interaction = new CommandInteraction())
{

    const { mercy }                     = interaction.client
    const { shard, count, account_name} = Input.command(interaction);
  
    const member                        = mercy.initialize(interaction);
    const account                       = member.account.get(account_name);

    if  (!account) 
    {
        return interaction.followUp({ content: message.error.account.notFound(account_name), flags: MessageFlags.Ephemeral})
    }
    
    account.pull(shard, count);
   
    interaction.followUp({ content: message.pull(member, count, shard)});

    mercy.update(member);
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
    	.setName('pull')
    	.setDescription('Track and log shard pulls')
        .addStringOption(option =>
            option.setName('shard')
                .setDescription('Shard type to pull')
                .setRequired(true)
                .addChoices(
                    { name: 'ancient',  value: 'ancient' },
                    { name: 'void',     value: 'void'    },
                    { name: 'primal',   value: 'primal'  },
                    { name: 'sacred',   value: 'sacred'  },
                ))
    	.addIntegerOption(option =>
    		option.setName('count')
    			.setDescription('Number of shards to pull')
    			.setRequired(true)
    			.setMinValue(-999)
    			.setMaxValue(999))
    	.addStringOption(option =>
    		option.setName('account_name')
    			.setDescription('Specify alternate account (if not \'main\')')
    			.setAutocomplete(true),
    	),
        
    execute: pull
});

export default command;