import { log } from '#utils'


export const event = 
{
    meta: 
    {
        id:             "unhandledRejection",
        name:           "unhandledRejection",
        type:           "event",
        category:       "system",
        description:    "Unhandled Rejection handler",
    },

    flag: 
    {
        load:           true,
        once:           false,
    },

	execute: async (bot, reason, promise) =>
    {
        if (reason instanceof Error) 
        {
            process.emit("uncaughtException", reason);
        }
        else
        {
            log.error(`Unhandled Rejection at:`, promise, 'reason:', reason);
        }
    },
};

export default event;
