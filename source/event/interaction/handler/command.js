import { MessageFlags } from "discord.js";
import { log } from '../../../../utility/index.js'

class CommandHandler
{
        constructor(client, registry)
    {
        this.client   = client;
        this.registry = registry;
    }

    async handle(interaction)
    {
        const { data: command, data: { flag } } = interaction;

         
        if (flag.handled || !interaction.isChatInputCommand())
        {
            return;
        }

        try
        {
            await command.execute(interaction);
        } 
        catch (error) 
        {
            log.error(error);
            await interaction.editReply({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
        }
        flag.handled = true;
    }
}

export { CommandHandler }