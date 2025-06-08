import { CommandInteraction, SlashCommandBuilder }  from "discord.js";
import { Schema }                                   from "#utils/index.js";


async function refresh(interaction = new CommandInteraction())
{
    const promocode                         = interaction.client.promocode

    promocode.refresh();

    return interaction.editReply(`Promocode board refreshed successfully`)
}



const command = Schema.command
({
    meta: 
    {
        id:             "promocode-refresh",
        type:           "command",
        description:    "promocode management - refresh promocode board",
    },

    permission: 
    {
        cooldown:       0,
        access:         [],
        require:
        {
            channels:   [],
            roles:      ['Officer', 'Deputy', "Moderator"],
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

        permission:     true,
        require:        true,
        exclude:        false,

        maintenance:    false,
        autocomplete:   false,
        navigation:     false,
        
        handled:        false,
        autoload:       true,

    },

    data: new SlashCommandBuilder()
    	.setName('promocode-refresh')
    	.setDescription('Refresh the promo code board'),

    execute: refresh
});

export default command;
