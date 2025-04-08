import { ActionRowBuilder } from '@discordjs/builders';
import { Text }             from './text.js';
import { log }              from '../logger/log.js'
import lodash               from 'lodash';
import { MessageFlags } from 'discord.js';

class EmbedManager
{
    constructor(interaction)
    {
        this.interaction    = interaction;
        
        this.client         = this.interaction.client;
        this.registry       = this.client.registry;

        this.component      = new ComponentManager(interaction);
        
        this.data           = null;
        this.embeds         = [];
        this.components     = [];

    }

    static set(interaction)
    {
        return new EmbedManager(interaction);
    }

    load(embedID)
    {
        this.data           = lodash.cloneDeep(this.registry.embed.get(embedID));
        return this;
    }
    
    modify(modifier)
    {
        modifier(this.data)
        return this;
    }

    create()
    {
        this.loadEmbed(this.data);
        this.loadComponents(this.data);
   
        return { embeds: this.embeds , components: this.components, flags: this.data.flag.ephemeral ? MessageFlags.Ephemeral : 0 };
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

    modifyComponents(modifier) 
    {
        modifier(this.data);
        return this;
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
        log.trace(`Loading ${embed.meta.id}'s components`)

        for (const row of embed.row) 
        {
            try 
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
            catch (error) 
            {
                load.error(`Attempted to load invalid row: ${row}`)
            }
        }

        return this.row
    }

    loadButton(buttons)
    {
        for (const buttonID of buttons)
        {
            try 
            {
                const data = this.registry.button.get(buttonID);
               
                this.button.addComponents(data.load(this.interaction));
                log.trace(`${Text.set(buttonID).constrain(20)} button load executed`)

            } 
            catch (error) 
            {
                log.error(`Attempted to create invalid button: ${buttonID}`, error)
            }
        }

        this.row.push(this.button);
        this.button = new ActionRowBuilder();
    }

    loadMenu(menus)
    {
        for (const menuID of menus)
        {    
            try 
            {
                const data = this.registry.menu.get(menuID)

                this.menu.addComponents(data.load(this.interaction));
                log.trace(`${Text.set(menuID).constrain(20)} menu load executed`)

                this.row.push(this.menu);        
                this.menu = new ActionRowBuilder();
            } 
            catch (error) 
            {
                log.error(`Attempted to create invalid menu: ${menuID}`, error)
            }
        }
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