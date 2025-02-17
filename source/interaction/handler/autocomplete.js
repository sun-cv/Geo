

class AutocompleteHandler
{
    constructor(client, registry)
    {
        this.client     = client;
        this.registry   = registry;
    }

    handle(interaction)
    {
    	const autocomplete = interaction.data

        if (!autocomplete.flag.autocomplete && !interaction.isAutocomplete())
        {
            return;
        }

        autocomplete.flag.handled = true;

        this.respond(interaction)
    }

    respond(interaction)
    {
        const autocomplete  = interaction.data
        const values        = autocomplete.execute(interaction)
 
        const filtered      = values.filter((choice) => choice.toLowerCase().startsWith(interaction.options.getFocused().toLowerCase())).map((choice) => ({name: choice, value: choice}));

        interaction.respond(filtered);
    }
}


export { AutocompleteHandler }