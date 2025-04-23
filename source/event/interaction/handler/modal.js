import { Collection, MessageFlags } from "discord.js";
import { log } from "../../../../utility/index.js";

class ModalHandler
{
    constructor(client, registry)
    {
        this.client     = client;
        this.registry   = registry;

        this.cache      = new Collection();
    }


    async handle(interaction)
    {
        const { data: { flag } } = interaction;

        if (flag.handled.get() || !interaction.isModalSubmit() || this.existingModal(interaction))
        {
            return;
        }

        try 
        {
            await this.modalInteraction(interaction);    
        } 
        catch (error) 
        {
            log.error(error);
        }
        flag.handled.set()

        this.clearCache(interaction);
    }



    existingModal(interaction)
    {
        const modalID   = this.registry.modal.cache.get(interaction.member.id);
        const existing  = interaction.customId === this.registry.modal.cache.get(interaction.member.id)?.meta?.id;

        if (modalID && !existing)
        {
            this.clearCache(interaction);
            return false;
        }
        return existing;
    }
    


    async modalInteraction(interaction)
    {
        const modal = interaction.data
        try
        {
            modal.execute(interaction);
        } 
        catch (error) 
        {
            log.error(error)
            await interaction.editReply({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
        }
        modal.flag.handled.set();
    }


    clearCache(interaction)
    {
        this.registry.modal.cache.delete(interaction.member.id);
    }




}

export { ModalHandler } 