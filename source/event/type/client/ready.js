import { Events } from 'discord.js';
import { log }    from '../../../../utility/logger/log.js'


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
		console.log(`Ready! Logged in as ${client.user.tag}`);

		client.guilds.cache.forEach(async (guild) => 
        {
			await guild.members.fetch();
			console.log(`Fetched ${guild.members.cache.size} members for guild: ${guild.name}`);
		});
	},
};

export default event;