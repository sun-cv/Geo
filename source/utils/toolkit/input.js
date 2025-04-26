

class Input
{
    static command(interaction)
    {
        const input = {}

        for (const option of interaction.options._hoistedOptions)
        {
            input[option.name] = interaction.options.get(option.name).value;
        }
        return input;
    }

    static modal(interaction)
    {
        const input = {}
        interaction.fields.fields.forEach(option => 
        {
            input[option.customId] = option.value;
        });
        return input;
    }

    static menu(interaction)
    {
        if (interaction.values)
        {
            return interaction.values
        }
        return [false];
    }
}


export { Input };