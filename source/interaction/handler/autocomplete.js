

class AutocompleteHandler
{
    constructor(client, registry)
    {
        this.client     = client;
        this.registry   = registry;
    }

    handle(interaction) 
    {
        const { flag } = interaction.data;
        
        if (flag.handled || !flag.autocomplete || interaction.isChatInputCommand()) 
        {
            return;
        }
    
        flag.handled = true;
        this.respond(interaction);
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