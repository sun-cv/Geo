import { CommandInteraction, MessageFlags, SlashCommandBuilder }    from "discord.js";
import { Input, Schema }                                            from '../../../utility/index.js'
import { template }                                                 from "../../data/template/templateMercy.js";
import { error }                                                    from "../../data/template/templateGeneric.js";
import Shards                                                       from '../../data/mercy/shards.json' with { type: 'json' }
async function success(interaction = new CommandInteraction())
{
    const { mercy }                                     = interaction.client
    const input                                         = Input.initialize(interaction);
    const { count, start, event, account_name, share }  = input;
    
    const [shard, rarity = 'legendary']                 = input.shard.split('.');

    const member                                        = mercy.initialize(interaction);
    const account                                       = member.getAccount(account_name);

    if  (!account) 
    {
        return interaction.followUp({ content: error.account.notFound(account_name), flags: MessageFlags.Ephemeral})
    }
    
    const { base, start: mercyStart, increase } = Shards.mercy[shard][rarity];
    const total                                 = account.mercy[shard][rarity]?.total || 0;
    const initial                               = start ?? total;
    const adjustedBaseChance                    = event ? base * 2 : base;

    const totalFailChance = Array.from({ length: count }, (_, i) =>
    {
        const current = initial + i;
        return 1 - (adjustedBaseChance + Math.max(0, current - mercyStart + 1) * increase) / 100;

    }).reduce((acc, failChance) => acc * Math.max(failChance, 0.01), 1);

    const successChance = Math.min(100, (1 - totalFailChance) * 100);

    return interaction.followUp({ content: template.success(member, initial, shard, rarity, count, successChance) });
}


const command = Schema.command
({
    meta: 
    {
        id:             "success",
        type:           "command",
        description:    "Mercy tracker success command - calculates % chance success of pulling successfully based on provided parameters and current mercy.",
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
    	.setName('success')
    	.setDescription('Calculate success chance of pulling a provided number of shards (and more!)')
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
        .addIntegerOption(option =>
            option.setName('count')
                .setDescription('Number of shards to pull')
                .setRequired(true)
                .setMinValue(-999)
                .setMaxValue(999))
        .addIntegerOption(option =>
    		option.setName('start')
    			.setDescription('Specify your own starting count.')
    			.setRequired(false)
    			.setMinValue(0)
    			.setMaxValue(999))
    	.addStringOption(option =>
    		option.setName('event')
    			.setDescription('Is it a 2x event?')
    			.setRequired(false)
    			.addChoices(
    				{ name: 'true',     value: 'true'   },
    				{ name: 'false',    value: 'false'  },
    			))
        .addStringOption(option =>
            option.setName('account_name')
                .setDescription('Specify alternate account (if not \'main\')')
                .setAutocomplete(true))
    	.addStringOption(option =>
    		option.setName('share')
    			.setDescription('Share your calculation')
    			.addChoices(
    				{ name: 'true',     value: 'true'   }
                )),

    execute: success
});


export default command