import { MessageFlags } from "discord.js";
import { log } from '../../../utility/index.js'

class MenuHandler
{
        constructor(client, registry)
    {
        this.client   = client;
        this.registry = registry;
    }

    async handle(interaction)
    {
        const { data: menu, data: { flag } } = interaction;
         
        if (flag.handled || !interaction.isAnySelectMenu())
        {
            return;
        }

        console.log('menu')

        try
        {
            await menu.execute(interaction);
        } 
        catch (error) 
        {
            log.error(error);
            await interaction.editReply({ content: 'There was an error while loading this menu', flags: MessageFlags.Ephemeral });
        }
        flag.handled = true;
        
    }
}

export { MenuHandler }