import { log } from '#utils'


class AutocompleteHandler
{
    constructor(client, registry)
    {
        this.client     = client;
        this.registry   = registry;
    }

    async handle(interaction) 
    {
        const { data, data: { flag }} = interaction;
        
        if (flag.handled.get() || !flag.autocomplete.get() || !interaction.isAutocomplete()) 
        {
            return;
        }

        try 
        {
            this.respond(interaction);
        } 
        catch (error) 
        {
            log.error(error);
        }
        flag.handled.set()
    }
    

    respond(interaction)
    {
        const autocomplete  = interaction.data
        const values        = autocomplete.execute(interaction)
        const focused       = interaction.options.getFocused().toLowerCase();
 
        const filtered      = [];

        for (const choice of values) 
        {
            if (filtered.length >= 25)
            {
                break;
            }
            if (choice.toLowerCase().includes(focused)) 
            {
                filtered.push({ name: choice, value: choice });
            }
        }

        interaction.respond(filtered);
    }
}


export { AutocompleteHandler }