import { log } from "../../utility/index.js";

function account_name(interaction)
{
    const { mercy } = interaction.client
    const member    = mercy.initialize(interaction);

    log.trace(`Returning ${member.member}'s autocomplete account values: ${member.accounts}`)

    return member.accounts;
}


const autocomplete = 
{
    meta: 
    {
        id:             "account_name",
        type:           "autocomplete",
        description:    "Mercy member account autocomplete. Returns all existing account names.",
    },

    flag: 
    {
        handled:        false,
        ignore:         false,
        defer:          false,
        ephemeral:      false,
        access:         false,
        maintenance:    false,
        autocomplete:   true,
    },

    roleAssignment:     {},
    execute: account_name
};

export default autocomplete;