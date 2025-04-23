import { Collection, Events } from "discord.js";
import { log, Tracer } from "../../../utility/index.js";
import { Filter } from "./handler/filter.js";

class Message
{
    constructor(client, registry)
    {
        this.client     = client
        this.registry   = registry;

        this.filter     = new Filter(this.registry) 
    }

    create =
    {
        meta: 
        {
            id:             Events.MessageCreate,
            name:           "MessageCreate",
            type:           "event",
            category:       "client",
            description:    "Geo client message create event; redirects to handlers.",
        },
    
        execute: async (client, message) =>
        {
            await this.log(message);
            await this.controller(client, message);
        },
    }
    

    async controller(client, message)
    {
        await this.registry     .loadMessageData(message);

        await this.filter       .handle(message);

        await this              .finalize(message)
    }


    async log(message)
    {
        message.tracer = new Tracer()
    }

    async finalize(message)
    {
        await message.tracer.close()
        log.message(message)
    }

}


export { Message }


// ---

// ### 🔍 Basic Info
// - `message.content` – The text content of the message.
// - `message.author` – The user who sent the message (`User` object).
// - `message.member` – The member (user + guild info), only available in guilds.
// - `message.channel` – The channel the message was sent in.
// - `message.guild` – The guild/server the message was sent in (if not a DM).

// ---

// ### 🛠 Metadata
// - `message.id` – The unique message ID.
// - `message.createdTimestamp` – When the message was created (ms since epoch).
// - `message.editedTimestamp` – If edited, the last edit timestamp.
// - `message.type` – The type of message (e.g., regular, reply, system, etc.).

// ---

// ### 📎 Attachments & Embeds
// - `message.attachments` – Collection of file uploads (`Attachment` objects).
// - `message.embeds` – Any rich embeds in the message.
// - `message.stickers` – Stickers included with the message.
// - `message.components` – If it includes buttons/select menus.

// ---

// ### 👥 Mentions
// - `message.mentions.users` – Users mentioned.
// - `message.mentions.members` – Guild members mentioned.
// - `message.mentions.roles` – Roles mentioned.
// - `message.mentions.channels` – Channels mentioned.
// - `message.mentions.has(user/role/etc)` – Check if a specific mention exists.

// ---

// ### 🧵 Threads & Replies
// - `message.hasThread` – If this message starts a thread.
// - `message.thread` – The thread started from this message.
// - `message.reference` – Info about the replied-to message.
// - `message.fetchReference()` – Fetch the actual replied-to message.

// ---

// ### 🔒 Permissions & Flags
// - `message.flags` – Message flags (e.g., `CROSSPOSTED`, `SUPPRESS_EMBEDS`).
// - `message.pinned` – If it's pinned in the channel.
// - `message.crosspostable` – If it can be crossposted.

// ---

// ### ✅ Helper Methods
// - `message.reply(content)` – Reply to the message.
// - `message.react(emoji)` – Add a reaction.
// - `message.delete()` – Delete the message.
// - `message.edit(newContent)` – Edit it.
