export const event = 
{
    meta: 
    {
        id:             "SIGINT",
        name:           "Signal interrupt",
        type:           "event",
        category:       "system",
        description:    "Geo bot shutdown (ctrl+c)",
    },

    flag: 
    {
        ignore:         false,
        once:           true,
    },

	execute: async (bot) =>
    {
        bot.shutdown();
	},
};

export default event;
