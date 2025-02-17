


function testing(interaction)
{
    const { mercy }                     = interaction.client

    const member                        = mercy.initialize(interaction);

    return member.accounts;
}


const autocomplete = 
{
    meta: 
    {
        id:             "testing2",
        type:           "autocomplete",
        description:    "Mercy champion autocomplete",
    },

    flag: 
    {
        handled:        false,
        ignore:         false,
        defer:          false,
        ephemeral:      false,
        access:         false,
        maintenance:    false
    },

    roleAssignment:     {},
    execute:  testing
};

export default autocomplete;