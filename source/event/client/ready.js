import { Events } from 'discord.js';
import { log }    from '../../../utility/logger/log.js'


export const event = 
{
    meta: 
    {
        id:             Events.ClientReady,
        name:           "client ready",
        type:           "event",
        category:       "client",
        description:    "Geo bot - discord communication established. Client ready event",
    },

    flag: 
    {
        once:           true,
    },

	execute: async (client) =>
    {
        log.system("All systems online. Engage!")

		client.guilds.cache.forEach(async (guild) => 
        {
			await guild.members.fetch();
			log.system(`${guild.name} has ${guild.members.cache.size} members`);
		});
	},
};

export default event;