import { Events } from 'discord.js'


class Interaction
{
    constructor(client, registry)
    {
        this.client     = client
        this.registry   = registry;
        
        // this.commandHandler = new CommandHandler(client, registry);

    }

    create =
    {
        meta: 
        {
            id:             Events.InteractionCreate,
            name:           "InteractionCreate",
            type:           "event",
            category:       "client",
            description:    "Geo client interaction create event; redirects to handlers.",
        },
    
        execute: async (client, interaction) =>
        {
            await this.routeInteraction(client, interaction)
        },
    }
    

    async routeInteraction(client, interaction)
    {
        console.log('test')
        console.log(interaction)
    }

}


export { Interaction }