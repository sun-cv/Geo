import { ActionRowBuilder, ButtonBuilder, ModalBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, TextInputBuilder } from '@discordjs/builders';
import { TextInputStyle } from 'discord.js';

class Component 
{
    static button(customID) 
    {
        return Button.create(customID);
    }

    static menu(customID) 
    {
        return Menu.create(customID);
    }

    static modal(customID) 
    {
        return Modal.create(customID);
    }

}

class Button 
{
    constructor(button) 
    {
        this.button = button;
    }

    static create(customID) 
    {
        return new Button(new ButtonBuilder().setCustomId(customID));
    }

    label(value) 
    {
        this.button.setLabel(value);
        return this;
    }

    style(value) 
    {
        this.button.setStyle(value);
        return this.button;
    }

    build()
    {
        return this.button
    }
}


class Menu 
{
    constructor(menu) 
    {
        this.menu = menu;
    }

    static create(customID) 
    {
        return new Menu(new StringSelectMenuBuilder().setCustomId(customID));
    }

    placeholder(message) 
    {
        this.menu.setPlaceholder(message);
        return this;
    }

    values(min, max) 
    {
        this.menu.setMinValues(min).setMaxValues(max);
        return this;
    }

    arrayOptions(options) 
    {
        options.slice(0, 25).forEach(option => 
        {
             this.menu.addOptions(new StringSelectMenuOptionBuilder().setLabel(option).setValue(option));
        });

        if (options.length == 0)
        {
            this.menu.addOptions(new StringSelectMenuOptionBuilder().setLabel('No options!').setValue('false'))
        }
        return this.menu;
    }

    mapOptions(options) 
    {
        Array.from(options).slice(0, 25).forEach(([key, value]) => 
        {
            this.menu.addOptions(new StringSelectMenuOptionBuilder().setLabel(String(key)).setValue(String(value)));
        });
        return this.menu;
    }

}

class Modal 
{
    constructor(modal) 
    {
        this.modal = modal;
        this.inputs = []; // Store text inputs
    }

    static create(customID) 
    {
        return new Modal(new ModalBuilder().setCustomId(customID));
    }

    title(value) 
    {
        this.modal.setTitle(value);
        return this;
    }

    addTextInput(customID, label, style = TextInputStyle.Short, required = false, placeholder = "") 
    {
        const input = new TextInputBuilder()
            .setCustomId(customID)
            .setLabel(label)
            .setStyle(style)
            .setRequired(required)
            .setPlaceholder(placeholder);

        this.inputs.push(input);
        return this;
    }

    build() 
    {
        this.inputs.forEach(input => 
        {
            this.modal.addComponents(new ActionRowBuilder().addComponents(input));
        });

        return this.modal;
    }
}


export { Component }