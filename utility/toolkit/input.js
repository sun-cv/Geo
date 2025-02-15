

class Input
{
    static initialize(interaction)
    {
        const input = {}

        for (option of interaction.options)
        {
            input[option] = interaction.options.get(option)
        }
        return input;
    }
}


export { Input };