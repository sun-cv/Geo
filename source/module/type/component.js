import { log } from "../../../utility/index.js"

async function registerComponent(component, registry) {
    	if (component.flag.ignore) 
    {
        return;
    }  
    registry[component.meta.type].set(component.meta.id, component.execute)
    log.trace(component.meta.id)
}

export { registerComponent };


// export const component = {
//     meta: 
//     {
//         id:             "",    // Unique identifier (e.g., "ping", "confirm-modal")
//         type:           "",    // "command", "button", "menu", "modal", "filter"
//         description:    "",    // Short explanation
//     },

//     access: 
//     {
//         cooldown:       0,
//         permissions:    [],    // Required Discord permissions (e.g., ["ADMINISTRATOR"])
//         channels:       [],    // Required channel location
//         roles:          [],    // Required role IDs (for finer control)
//     },

//     flag: 
//     {
//         ignore:         false,  // Flag to ignore load 
//         defer:          false   // Whether it defers the reply
//     },

//     execute: async (interaction, client) => {} // Execution function
// };