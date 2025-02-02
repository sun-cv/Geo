

async function registerCommand(command, registry) {
    
	if (command.flag.ignore) 
    {
        return;
    }  
    registry[command.meta.type].set(command.meta.id, command.execute)
}

export { registerCommand };




// const command = {
//     meta: 
//     {
//         id:             "test-command",     // Unique identifier (e.g., "ping", "confirm-modal")
//         type:           "command",          // "command", "button", "menu", "modal", "filter"
//         description:    "this is a test",   // Short explanation
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
//         defer:          false,  // Whether it defers the reply
//         maintenance:    false   // Whether command is under maintenance (may be moved)
//     },
//     data: {},

//     execute: async (interaction, client) => {} // Execution function
// };

// export default command;