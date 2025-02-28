import { ActionRowBuilder } from '@discordjs/builders';
import { Text }             from './text.js';
import { log }              from '../logger/log.js'
Text

class EmbedManager
{
    constructor(interaction)
    {
        this.interaction    = interaction;
        
        this.client         = this.interaction.client;
        this.registry       = this.client.registry;

        this.component      = new ComponentManager(interaction);
        
        this.embeds         = [];
        this.components     = [];

    }

    static set(interaction)
    {
        return new EmbedManager(interaction);
    }

    load(embedID)
    {
        const data          = this.registry.embed.get(embedID);

        this.loadEmbed(data);
        this.loadComponents(data);

        return { embeds: this.embeds , components: this.components, ephemeral: data.flag.ephemeral };
    }

    loadEmbed(embed)
    {
        this.embeds.push(embed.load(this.interaction));
        log.debug(`Successfully loaded embed ${embed.meta.id}`)
    }

    loadComponents(embed)
    {
        this.components = this.component.load(embed);
        log.debug(`Successfully loaded embed ${embed.meta.id} components`)
    }

}




class ComponentManager
{
    constructor(interaction)
    {
        this.interaction    = interaction;
        
        this.client         = this.interaction.client;
        this.registry       = this.client.registry;

        this.row            = [];
        this.button         = new ActionRowBuilder();
        this.menu           = new ActionRowBuilder();
    }

    load(embed)
    {
        log.trace(`Loading embed ${embed.meta.id} components`)
        for (const row of embed.row) 
        {
            const [type, value] = Object.entries(row)[0]

            if (this[`load${type.charAt(0).toUpperCase() + type.slice(1)}`]) 
            {
                this[`load${type.charAt(0).toUpperCase() + type.slice(1)}`](value);
                log.trace(`Loading ${type} component`)
                continue;
            }
            log.debug(`No component loader found for type: ${type}`);
        }

        return this.row
    }

    loadButton(buttons)
    {
        for (const buttonID of buttons)
        {
            const data = this.registry.button.get(buttonID);

            this.button.addComponents(data.load(this.interaction));
            log.trace(`${Text.set(buttonID).constrain(20)} button load executed`)
        }

        this.row.push(this.button);
        this.button = new ActionRowBuilder();
    }

    loadMenu(menuID)
    {
        {
            const data = this.registry.menu.get(menuID)
            
            this.menu.addComponents(data.load(this.interaction));
            log.trace(`${Text.set(menuID).constrain(20)} menu load executed`)
        }

        this.row.push(this.menu);
        this.menu = new ActionRowBuilder();
    }

}


class Embed
{
    constructor(embed)
    {
        this.embed = embed
    }

    static set(embed)
    {
        return new Embed(embed);
    }

    buffer(count, limit, inline = true)
    {
        for (let i = 0; i < count; i++) 
        {
	    	this.embed.addFields({ name: ' ', value: `${Text.set(' ').constrain(limit, {paddingChar: '⠀'})}`, inline: inline});
	    }
        return this;
    }


}


export { Embed, EmbedManager }