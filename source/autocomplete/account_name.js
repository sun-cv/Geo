import { log, Schema } from '#utils';

function account_name(interaction)
{
    const { mercy } = interaction.client
    const member    = mercy.autofill(interaction);
    const accounts  = member.accounts.map((account) => account.name);

    log.trace(`Returning ${member.username}'s autocomplete account values: ${accounts}`)

    return accounts;
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