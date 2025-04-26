import path                 from 'node:path';
import { log, FileManager } from '#utils'


class Dispatcher
{
    constructor(client)
    {
        this.bot        = null;
        this.client     = client;

        this.directory  = 
        {
            "client": path.join(process.cwd(), "source", "events", "client"),
            "system": path.join(process.cwd(), "source", "events", "system"),
        }

        this.listeners  = 
        {
            "client": (event) => this.registerClient(event),
            "system": (event) => this.registerSystem(event),
        };

    }

    async setContext(bot)
    {
        this.bot = bot;
    }

    async registerEvents()
    {
        for (const [category, filePath] of Object.entries(this.directory))
        {
            await FileManager.loadDirectory(filePath, (event) => this.routeEvent(event, category));
        }
    }

    async routeEvent(event, category)
    {
        const listener = this.listeners[category];

        if (!listener)
        {
            log.error(`${event.meta.name} listener registration failed:  (invalid event category)`);
            return;
        }
        await listener(event);
    }


    async registerSystem(event, ...args)
    {
        if (event.flag && event.flag.once)
        {
            process.once(event.meta.id, (...args) => event.execute(this.bot, ...args));
        }
        else
        {
            process.on(event.meta.id,   (...args) => event.execute(this.bot, ...args));
        }
        log.debug(`Registered event: ${event.meta.name}`)
    }

    async registerClient(event, ...args) 
    {
        if (event.flag && event.flag.once)
        {
            this.client.once(event.meta.id, (...args) => event.execute(this.client, ...args));
        }
        else
        {
            this.client.on(event.meta.id,   (...args) => event.execute(this.client, ...args));
        }
        log.debug(`Registered event: ${event.meta.name}`)
    }

}

export { Dispatcher };