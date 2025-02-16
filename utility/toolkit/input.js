

class Input
{
    static initialize(interaction)
    {
        const input = {}

        for (const option of interaction.options._hoistedOptions)
        {
            input[option.name] = interaction.options.get(option.name).value;
        }
        return input;
    }
}


export { Input };