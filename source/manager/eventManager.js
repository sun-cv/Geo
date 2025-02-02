import { log } from "../../utility/index.js"

class eventManager
{
    constructor(client)
    {
        this.client = client;
        this.events = new Map();

        initialize();
    }

    async initialize()
    {
        await this.registerEvents(client);

    }


    async registerEvents(client, dirPath = path.join(__dirname, '..', '..', 'events')) 
    {
        const items = fs.readdirSync(dirPath);
    
        for (const item of items) 
        {
            const itemPath  = path.join(dirPath, item);
            const stats     = fs.statSync(itemPath);
    
            if (stats.isDirectory()) 
            {
                loadEvents(client, itemPath);
            }
            else if (item.endsWith('.js')) 
            {
                const event = await import(itemPath);
    
                if (event.once) 
                {
                    client.once(event.name, (...args) => event.execute(client, ...args));
                }
                else 
                {
                    client.on(event.name, (...args) => event.execute(client, ...args));
                }
                log.system(`Successfully registered ${event.name} listener`)
            }
        }
    }
}

