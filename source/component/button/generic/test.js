



const component = {
    meta: 
    {
        id:             "test-component",    // Unique identifier (e.g., "ping", "confirm-modal")
        type:           "button",    // "command", "button", "menu", "modal", "filter"
        description:    "",    // Short explanation
    },

    access: 
    {
        cooldown:       0,
        permissions:    [],    // Required Discord permissions (e.g., ["ADMINISTRATOR"])
        channels:       [],    // Required channel location
        roles:          [],    // Required role IDs (for finer control)
    },

    flag: 
    {
        ignore:         false,  // Flag to ignore load 
        defer:          false   // Whether it defers the reply
    },

    execute: async (interaction, client) => {} // Execution function
};

export default component;