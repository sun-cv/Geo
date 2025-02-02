const { nextExecutionTime } = require('../../tasks/functions/nextExecutionTime');
const { newTimestamp } = require('../functions/time/newTimestamp');


class EventHandler
{
    constructor()
    {
        this.events = new Map();
    }

    async generateEvent(interaction)
    {
        if (this.events.has(interaction.id))
        {
            return this.events.get(interaction.id);
        }
        const event = createEvent(interaction);
        this.events.set(interaction.id, event);
        return event;
    }

    async createEvent(interaction)
    {
        if (interaction.isCommand())
        {
            return new Command(interaction);
        }
		if (interaction.isButton())
        {
            return new Button(interaction);
        }
		if (interaction.isAnySelectMenu()) return new Menu(interaction);
		if (interaction.isModalSubmit())   return new Modal(interaction);
		return new Default();
    }


}



class Event 
{
    constructor(interaction) 
    {
        this.interaction = interaction;
        this.member = interaction.member.user;
        this.data =  {},
        this.flag = 
        {
            handled: false
        }
        this.tracer = new Tracer();
    }
}

class Command extends Event 
{
	constructor(interaction)
    {
		super(interaction);
		this.command = interaction.client.commands.get(interaction.commandName);
		this.parameters = constructFullCommand(this.interaction);
	}
}

class Button extends Event 
{
	constructor(interaction) 
    {
		super(interaction);
		this.button = interaction.client.buttons.get(interaction.customId);
	}
}

class Menu extends Event 
{
	constructor(interaction) 
    {
		super(interaction);
		this.menu = interaction.client.menus.get(interaction.customId);
		this.values = interaction.values;
	}
}

class Message extends Event {
	constructor({ message: message, filter: filter }) 
    {
		super();
		this.message = message;
		this.filter = filter;
	}
}

class Modal extends Event
{
	constructor(interaction) 
    {
		super(interaction);
		this.modal = true;
	}
}


class Task 
{
	constructor(data) 
    {
		super(data);
		this.name = data.name;
		this.arguments = data.arguments;
		this.cron = data.cron;
		this.execute = data.execute;
		this.data = data;
		this.run = false;
		this.nextExecution = nextExecutionTime(this.cron);
	}
}

module.exports = {
	Event, Command, Button, Menu, Message, Modal, Default, Task, Tracer,

};

function constructFullCommand(interaction) 
{
	let command = `/${interaction.commandName}`;

	function handleOption(option)
    {
		command += ` ${option.name}`;

		if (option.value) 
        {
			command += ` ${option.value}`;
		}
		if (option.options) 
        {
			option.options.forEach(handleOption);
		}
	}
	interaction.options.data.forEach(handleOption);
	return command;
}