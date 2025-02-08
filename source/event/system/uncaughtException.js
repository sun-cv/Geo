import { log } from '../../../utility/index.js'


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
        ignore:         false,
        once:           false,
    },

	execute: (bot, error) =>
    {
        log.error(`uncaught Exception:`, error)
    },
};

export default event;
