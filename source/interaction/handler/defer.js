import { MessageFlags } from "discord.js";


class DeferHandler
{

    constructor()
    {
        this.ephemeral = false;
    }

    async handle(interaction)
    {
        if (!interaction.data.flag.defer || interaction.isAutocomplete())
        {
            return;
        }

        this.ephemeral = false;

        this.checkFlag(interaction);
        this.checkShare(interaction);

        if (!this.ephemeral)
        {
            return await interaction.deferReply();
        }
        await interaction.deferReply({flags: MessageFlags.Ephemeral});
    }


    checkFlag(interaction)
    {
        this.ephemeral = interaction.data.flag.ephemeral
    }

    checkShare(interaction)
    {
        this.ephemeral = interaction.options.getString('share') == 'true';
    }


}


export { DeferHandler }