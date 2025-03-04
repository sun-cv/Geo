import { log, Schema } from "../../utility/index.js";

function account_name(interaction)
{
    const { mercy } = interaction.client
    const member    = mercy.initialize(interaction);

    log.trace(`Returning ${member.member}'s autocomplete account values: ${member.accounts}`)

    return member.accounts;
}

const data = Schema.autocomplete
({
    meta: 
    {
        id:             "account_name",
        type:           "autocomplete",
        description:    "Mercy member account autocomplete. Returns all existing account names.",
    },

    execute: account_name
})


export default data;