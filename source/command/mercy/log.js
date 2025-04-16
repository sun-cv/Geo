import { CommandInteraction, MessageFlags, SlashCommandBuilder }    from "discord.js";
import { Input, Schema }                                            from '../../../utility/index.js'
import { template }                                                 from "../../data/template/templateMercy.js";
import { error }                                                    from "../../data/template/templateGeneric.js";

async function log(interaction = new CommandInteraction())
{
    const { mercy }                         = interaction.client
    const input                             = Input.command(interaction);

    const { champion, source, rarity, count, account_name } = input;
        
    const member                            = mercy.initialize(interaction);
    const account                           = member.account.get(account_name)

    if  (!account) 
    {
        return interaction.followUp({ content: error.account.notFound(account_name), flags: MessageFlags.Ephemeral})
    }
    

    account.log(source, rarity, champion, count);
    account.update();    
    
    // interaction.followUp({ content: template.reset(member, account.session.lastChampion(), getMercyChance(shard, rarity, account.session.lastReset().total))})
}


const command = Schema.command
({
    meta: 
    {
        id:             "log",
        type:           "command",
        description:    "Mercy tracker log command - log champion pull if not pulled during a reset event",
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
    .setName('log')
    .setDescription('Manually log a champion pull')
    .addStringOption(option =>
    	option.setName('champion')
    		.setDescription('Select your champion')
    		.setRequired(true)
    		.setAutocomplete(true))
    .addStringOption(option =>
        option.setName('source')
            .setDescription('Select source')
            .setRequired(true)
            .addChoices(
                { name: 'ancient',      value: 'ancient'    },
                { name: 'void',         value: 'void'       },
                { name: 'primal',       value: 'primal'     },
                { name: 'sacred',       value: 'sacred'     },
                { name: 'prism',        value: 'prism'      },
                { name: 'fusion',       value: 'fusion'     },
                { name: 'fragment',     value: 'fragment'   },
                { name: 'remnant',      value: 'remnant'    },
                { name: 'doomtower',    value: 'doomtower'  },
                { name: 'reward',       value: 'reward'     },
                { name: 'other',        value: 'other'      }
            ))
    .addStringOption(option =>
        option.setName('rarity')
            .setDescription('Select rarity')
            .setRequired(true)
            .addChoices(
                { name: 'legendary',    value: 'legendary'  },
                { name: 'mythical',     value: 'mythical'   },
            ))
    .addIntegerOption(option =>
        option.setName('count')
            .setDescription('Optionally add count')
            .setRequired(false)
            .setMinValue(-999)
            .setMaxValue(999))
    .addStringOption(option =>
        option.setName('account_name')
            .setDescription('Specify alternate account (if not \'main\')')
            .setRequired(false)
            .setAutocomplete(true)),

    execute: log
});


export default command