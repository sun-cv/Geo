import { Collection } from 'discord.js';
import { Timestamp } from '../toolkit/timestamp.js';
import { logEnum, logString } from './definitions.js';
import { Text } from '../toolkit/text.js';
import { Input } from '../toolkit/input.js';

class Log 
{
    static instance = null;

    constructor()
    {
        if (Log.instance) return Log.instance;
        Log.instance    = this;

        this.logs       = new Collection();
        this.logLevel   = "trace";
    }

    setLevel(level) 
    {
        this.logLevel = level;
    }

    log(level, ...messages)
    {
        if (logEnum[level] < logEnum[this.logLevel])
        {
            return;
        } 
        console.log(logString[level], `${Timestamp.hour()} :`, ...messages);
    }

    trace(...args) { this.log("trace", ...args); };
    debug(...args) { this.log("debug", ...args); };
    event(...args) { this.log("event", ...args); };
    admin(...args) { this.log("admin", ...args); };
    error(...args) { this.log("error", ...args); };
    fatal(...args) { this.log("fatal", ...args); };

    initiate(interaction)
    {
        this.initializeUserLogs(interaction);
    }

    push(interaction, ...messages) 
    {
        const userLogs = this.logs.get(interaction.member.id)?.get(interaction.id);

        if (userLogs) 
        {
            userLogs.push(...messages);
        }
    }

    async interaction(interaction) 
    {
        const { member, tracer, values, data: { meta } } = interaction;

        const timestamp     = Timestamp.hour();
        const logPrefix     = `[event] ${timestamp} - ${Text.set(tracer.responseTime).constrain(5)} : ${member.user.username}`;
        const adminPrefix   = `[admin] ${timestamp} :`;

        const logMessages   = 
        {
            command:        `${logPrefix} used ${await this.constructCommand(interaction)}`,
            button:         `${logPrefix} is navigating ${meta.id}`,
            menu:           `${logPrefix} selected ${values}`,
            modal:          `${logPrefix} submitted modal ${meta.id}: ${interaction.isModalSubmit() ? JSON.stringify(Input.modal(interaction)) : ''}`,
            message:        `${tracer.endTime}: ${member.user.username} {} > {}`,
        };

        const interactionLogs = this.logs.get(member.id)?.get(interaction.id) || [];

        if (logMessages[meta.type])
        {
            console.log(logMessages[meta.type]);
        }

        interactionLogs.forEach(log => console.log(`${adminPrefix} ${log}`));
    }

    async message(message)
    {
        const { member, content, channel, tracer, data: { meta, condition }} = message;

        const filters = [...condition.filters].map((filter) => filter.meta.id)

        if (filters.length)
        {
            const timestamp     = Timestamp.hour();
            const logPrefix     = `[event] ${timestamp} - ${Text.set(tracer.responseTime).constrain(5)} : ${member?.user?.username}`;

            const logMessages   = 
            {
                message:        `${logPrefix} > ${filters.join(', ')} : ${content ? content : 'No message content found'}`,
            };

            if (logMessages[meta.type])
            {
                console.log(logMessages[meta.type]);
            }
        }
    }

    async constructCommand(interaction)
    {
        let fullCommand = `/${interaction.data.meta.id}`;

        function appendOption(option)
        {
            fullCommand += ` ${option.name}`;

            if (option.value)
            {
                fullCommand += ` ${option.value}`;
            }
            if (option.options)
            {
                option.options.forEach(appendOption);
            }
        }

        interaction.options?.data.forEach(appendOption);
        return fullCommand;
    }

    initializeUserLogs(interaction)
    {
        const userLogs = this.logs.get(interaction.member.id) || new Collection();

        userLogs.set(interaction.id, []);

        this.logs.set(interaction.member.id, userLogs);
    }
}



const log = new Log();

export { log };
