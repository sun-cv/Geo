import { Events } from 'discord.js';
import { log }    from '../../utility/logger/log.js'


export const event = {
    meta: 
    {
        id:             Events.ClientReady,
        name:           "client ready",
        type:           "event",
        description:    "Geo bot - discord communication established. Client ready event",
    },

    flag: 
    {
        ignore:         false,
        once:           true,
    },

	execute: async (client) =>
    {
        log.system("All systems online. Engage!")

		client.guilds.cache.forEach(async (guild) => 
        {
			await guild.members.fetch();
			log.system(`Fetched ${guild.members.cache.size} members for guild: ${guild.name}`);
		});
	},
};

export default event;