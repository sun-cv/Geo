import config               from "../../../environment/config.json" with { type: "json" };
import { 
    REST,
    Routes,
    SlashCommandBuilder }   from 'discord.js';

import { log }              from "../../../utility/index.js"

const commands = [];

async function loadCommand(command) 
{
	if (!command.load)
    {
		return
	}
	commands.push(file.data.toJSON());
}


async function deployCommands()
{
	try {
		log.system(`Reloading ${commands.length} (/) commands.`);

		const rest = new REST().setToken(config.token);
		const data = await rest.put
        (
			Routes.applicationGuildCommands(config.clientId, config.guildId),
			{ body: commands },
		);

		log.system(`Successfully reloaded ${data.length}/${commands.length} (/) commands.`);
	}
	catch (error) {
		log.error(error);
	}
}


export { loadCommand, deployCommands }


