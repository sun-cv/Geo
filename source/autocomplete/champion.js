import { log } from "../../utility/index.js";

function champion(interaction)
{


}


const autocomplete = 
{
    meta: 
    {
        id:             "champion",
        type:           "autocomplete",
        description:    "Mercy champion autocomplete. Returns all currently known champions for logging autocompletes.",
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
    execute: champion
};

export default autocomplete;