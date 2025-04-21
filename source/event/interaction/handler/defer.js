import { MessageFlags } from "discord.js";


class DeferHandler
{
    constructor()
    {
        this.flag       = MessageFlags.Ephemeral
        this.ephemeral  = MessageFlags.Ephemeral;
    }

    async handle(interaction)
    {

        const { data: { flag } } = interaction;

        if (flag.update)
        {
            return interaction.deferUpdate();
        }

        if (!flag.defer || interaction.isAutocomplete())
        {
            return;
        }

        this.clear()
        this.check(interaction);

        await interaction.deferReply({flags: this.ephemeral});
    }


    clear()
    {
        this.ephemeral = this.flag;
    }

    check(interaction)
    {
        this.ephemeral = (interaction.data.flag.ephemeral && (interaction.options?.getString('share') !== 'true')) ? this.flag : 0;
    }

}


export { DeferHandler }

