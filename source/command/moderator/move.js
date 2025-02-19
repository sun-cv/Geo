import { SlashCommandBuilder, AttachmentBuilder, CommandInteraction } from 'discord.js'
import axios from 'axios'

const DEBUG = false;

async function moveCommand(interaction = new CommandInteraction()) 
{
    const { channel, start, end, users = [], ignore = [] } = Input.initialize(interaction);

    const messagesToMove    = new Map();
    const startMessage      = await channel.messages.fetch(start);
    const endMessage        = end ? await channel.messages.fetch(end) : startMessage;
    
    if (!users.includes(startMessage.author.id))
    {
        users.push(startMessage.author.id);
    }
    if (endMessage && !users.includes(endMessage.author.id))
    {
        users.push(endMessage.author.id);
    }
    if (startMessage === endMessage || !endMessage) 
    {
        messagesToMove.set(start, startMessage);
    } 
    else 
    {
        const fetchedMessages = await chaannel.messages.fetch({ after: start, before: end });
        fetchedMessages.forEach(msg => 
        {
            if (users.includes(msg.author.id) && !ignore.includes(msg.id)) 
            {
                messagesToMove.set(msg.id, msg);
            }
        });
        messagesToMove.set(start, startMessage);
        if (endMessage) messagesToMove.set(end, endMessage);
    }
    
    
    const sortedMessages    = [...messagesToMove.values()].sort((a, b) => a.createdTimestamp - b.createdTimestamp);
    const messageWord       = sortedMessages.length === 1 ? 'message' : 'messages';
    const infoMessage       = await targetChannel.send(`${interaction.user} moved ${sortedMessages.length} ${messageWord} from ${channel}:`);
    
    let lastAuthorId        = null, output = '';

    for (const message of sortedMessages) 
    {
        if (message.author.bot) continue;
        
        const formattedTime = message.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
        if (message.author.id !== lastAuthorId) 
        {
            await targetChannel.send(`${message.author} at ${formattedTime}:`);
            lastAuthorId = message.author.id;
        }
        
        const attachments = await Promise.all(
            message.attachments.map(async attachment => 
            {
                const response = await axios.get(attachment.url, { responseType: 'arraybuffer' });
                return new AttachmentBuilder(Buffer.from(response.data), { name: attachment.name });
            })
        );
        
        await targetChannel.send({ content: message.content, files: attachments });
        await message.delete();

        output += `${message.author.username} ${formattedTime}\n${message.content}\n`;
    }
    
    if (DEBUG) log.debug('Moved messages.');
    const messageLink = `https://discord.com/channels/${interaction.guild.id}/${targetChannel.id}/${infoMessage.id}`;
    await interaction.editReply({ content: `<@${interaction.user.id}> moved ${sortedMessages.length} ${messageWord} to ${messageLink}` });
}

const command = {
    meta: 
    {
        id:             "move",
        type:           "command",
        description:    "Moves messages from one channel to another.",
    },

    access: 
    {
        cooldown:       0,
        permissions:    [],
        channels:       [],
        roles:          ["moderator"],
    },

    flag: 
    {
        ignore:         true,
        defer:          true,
        maintenance:    false
    },

	data: new SlashCommandBuilder()
		.setName('move')
		.setDescription('Moves messages from one channel to another.')
		.addChannelOption(option =>
			option.setName('channel')
				.setDescription('The channel to move messages to')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('start')
				.setDescription('ID of the first message to move')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('end')
				.setDescription('ID of the last message to move')
				.setRequired(false))
		.addStringOption(option =>
			option.setName('users')
				.setDescription('Add additional users by ID')
				.setRequired(false))
		.addStringOption(option =>
			option.setName('ignore')
				.setDescription('Ignore Message IDs')
				.setRequired(false)),
	execute: moveCommand,
};

export default command;
