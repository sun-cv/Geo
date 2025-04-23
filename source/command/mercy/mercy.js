import { CommandInteraction, MessageFlags, SlashCommandBuilder }    from "discord.js";
import { EmbedManager, Input, Schema }                                            from '../../../utility/index.js'
import { error }                                                    from '../../data/template/templateGeneric.js'
import { Image } from "./system/image/image.js";

async function mercy(interaction = new CommandInteraction())
{
    
    const { mercy }                     = interaction.client
    const { account_name, share} = Input.command(interaction);
  
    const member                        = mercy.initialize(interaction);
    const account                       = member.account.get(account_name);

    const flag = !share ? MessageFlags.Ephemeral : undefined


    if  (!account) 
    {
        await interaction.followUp({ content: error.account.notFound(account_name), flags: MessageFlags.Ephemeral})
        return;
    }
  
    if (account.settings.template.options.text.get())
    {
        await interaction.followUp(EmbedManager.set(interaction).load('embed-mercy-account-mercy-display').create())
        return;
    }
    
    const image = new Image(account);
    
    await image.generate();

    const attachment = image.canvas.toBuffer('image/png');

    await interaction.followUp({ files: [{ attachment: attachment, name: 'mercy.png' }]});
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
        ephemeral:      true,

        permission:     false,
        require:        false,
        exclude:        false,

        maintenance:    false,
        autocomplete:   true,
        navigation:     false,
        
        handled:        false,
        ignore:         false,

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
    			.setDescription('Share your account mercy')
    			.addChoices(
    				{ name: 'true',     value: 'true'   }
                )),
        
    execute: mercy
});

export default command;
