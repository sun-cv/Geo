import { MessageFlags } from "discord.js";
import { log } from "../../../../utility/index.js";


class ButtonHandler
{
    constructor(client, registry)
    {
        this.client     = client;
        this.registry   = registry;
    }

    async handle(interaction)
    {
        const { data: button, data: { flag } } = interaction;

        if (flag.handled.get() || !interaction.isButton())
        {
            return;
        }

        try
        {
            button.execute(interaction);
        }
        catch(error)
        {
            log.error(error);
            await interaction.editReply({ content: 'There was an error while executing this button!', flags: MessageFlags.Ephemeral });
        }

        flag.handled.set()
    }
}


export { ButtonHandler }