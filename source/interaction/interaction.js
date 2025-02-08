import { Events } from 'discord.js'
import { PermissionHandler } from './handler/permission.js';
import { CooldownHandler } from './handler/cooldown.js';
import { CommandHandler } from './handler/command.js';
import { Tracer, log } from '../../utility/index.js'

class Interaction
{
    constructor(client, registry)
    {
        this.client     = client
        this.registry   = registry;
        
        this.permission = new PermissionHandler(client, registry);
        this.cooldown   = new CooldownHandler(client, registry);

        // this.autofill   = new AutofillHandler(client, registry);
        this.command    = new CommandHandler(client, registry);
        // this.button     = new ButtonHandler(client, registry);
        // this.modal      = new ModalHandler(client, registry);
        // this.menu       = new MenuHandler(client, registry);

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
            await this.log(interaction);
            await this.defer(interaction);
            await this.controller(client, interaction);
        },
    }
    

    async controller(client, interaction)
    {

        await this.registry     .identify(interaction);

        await this.permission   .handle(interaction);
        await this.cooldown     .handle(interaction);

        // await this.autofill     .handle(interaction);
        await this.command      .handle(interaction);
        // await this.button       .handle(interaction);
        // await this.modal        .handle(interaction);
        // await this.menu         .handle(interaction);
        
        await this              .finalize(interaction)

    }

    async defer(interaction)
    {
        await interaction.deferReply();
    }

    async log(interaction)
    {
        log.initiate(interaction);
        interaction.tracer = new Tracer()
    }

    async finalize(interaction)
    {
        await interaction.tracer.close()
        log.interaction(interaction)
    }

}


export { Interaction }