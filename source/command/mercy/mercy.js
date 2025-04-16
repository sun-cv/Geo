import { CommandInteraction, MessageFlags, SlashCommandBuilder }    from "discord.js";
import { Input, Schema }                                            from '../../../utility/index.js'
import { error }                                                    from '../../data/template/templateGeneric.js'
import { Image } from "./system/image/image.js";

async function mercy(interaction = new CommandInteraction())
{
    
    const { mercy }                     = interaction.client
    const { account_name} = Input.command(interaction);
  
    const member                        = mercy.initialize(interaction);
    const account                       = member.account.get(account_name);

    if  (!account) 
    {
        return interaction.followUp({ content: error.account.notFound(account_name), flags: MessageFlags.Ephemeral})
    }
   
    const image = new Image(account);
    
    await image.generate();

    const attachment = image.canvas.toBuffer('image/png');

    interaction.followUp({ files: [{ attachment: attachment, name: 'mercy.png' }]});
}

const command = Schema.command
({
    meta: 
    {
        id:             "mercy",
        type:           "command",
        description:    "Mercy tracker mercy command - generates mercy image",
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
        ephemeral:      true,
        access:         false,
        maintenance:    false,
        autocomplete:   true,
    },

    roleAssignment:     {},

    data: new SlashCommandBuilder()
    	.setName('mercy')
    	.setDescription('Generate your current mercy')
    	.addStringOption(option =>
    		option.setName('account_name')
    			.setDescription('Specify alternate account (if not \'main\')')
    			.setAutocomplete(true),
    	)
        .addStringOption(option =>
    		option.setName('share')
    			.setDescription('Share your calculation')
    			.addChoices(
    				{ name: 'true',     value: 'true'   }
                )),
        
    execute: mercy
});

export default command;
