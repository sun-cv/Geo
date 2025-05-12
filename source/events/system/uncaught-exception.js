import { log } from '#utils'


export const event = 
{
    meta: 
    {
        id:             "uncaughtException",
        name:           "uncaughtException",
        type:           "event",
        category:       "system",
        description:    "Uncaught Exception handler",
    },

    flag: 
    {
        load:           true,
        once:           false,
    },

	execute: (bot, error) =>
    {
        log.error(`uncaught Exception:`, error)
    },
};

export default event;
