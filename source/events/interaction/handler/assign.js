import { MessageFlags }     from 'discord.js';
import { log }              from '#utils'
import { RoleAssignment }   from './role.js';

class AssignHandler
{
    constructor(client, registry)
    {
        this.client   = client;
        this.registry = registry;
    }

    async handle(interaction)
    {
        const { data, data: { flag } } = interaction;

        if (flag.handled.get())
        {
            return;
        }
        try
        {
            this.assign(interaction);
        } 
        catch (error) 
        {
            log.error(error);
            await interaction.editReply({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
        }        
    }

        // Assign additional interaction events or data
    assign(interaction)
    {
        RoleAssignment.set(interaction);
    }
}

export { AssignHandler }