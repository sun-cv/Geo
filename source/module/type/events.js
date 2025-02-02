import fs   from 'node:fs';
import path     from 'node:path';
import { log  } from "../../../utility/index.js"


async function registerEvent(event, client, registry) 
{
	if (event.once) 
    {
		client.once(event.name, (...args) => event.execute(client, ...args));
	}
	else 
    {
		client.on(event.name, (...args) => event.execute(client, registry, ...args));
	}
	log.system(`Successfully registered listener ${event.name}`)
}

export { registerEvent }

export const event = {
    meta: 
    {
        id:             "",    // Unique identifier (Events.ClientReady)
        name:           "",    // Name for event
        type:           "",
        description:    "",    // Short explanation
    },

    flag: 
    {
        ignore:         false,  // Flag to ignore load 
        once:           false,  // Flag to listen once or register permanent listener
    },

    execute: async (interaction, client) => {} // Execution function
};

export default event;