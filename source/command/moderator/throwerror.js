import fs   from 'node:fs';
import { SlashCommandBuilder, CommandInteraction } from 'discord.js';
import { log, Schema } from '../../../utility/index.js'

async function throwErrorCommand(interaction = new CommandInteraction()) {
	try {

		const errorType = interaction.options.getString('type');

		switch (errorType) {
		case 'TypeError':
			throw new TypeError('This is a TypeError');
		case 'RangeError':
			throw new RangeError('This is a RangeError');
		case 'ReferenceError':
			throw new ReferenceError('This is a ReferenceError');
		case 'SyntaxError':
			throw new SyntaxError('This is a SyntaxError');
		case 'URIError':
			throw new URIError('This is a URIError');
		case 'EvalError':
			throw new EvalError('This is an EvalError');
		case 'DatabaseError':
			await db.get('SELECT * FROM non_existent_table');
			break;
		case 'FileSystemError':
			await fs.readFile('/path/to/non/existent/file');
			break;
		case 'APIError':
			break;
		default:
			throw new Error('This is a generic Error');
		}
	}
	catch (error) {
		log.error(error);
	}
}



const command = Schema.command
({

    meta: 
    {
        id:             "throwerror",
        type:           "command",
        description:    "Throws an error for testing error handling.",
    },

    permission: 
    {
        cooldown:       0,
        access:         [],
        require:
        {
            active:     false,
            channels:   [],
            roles:      ["moderator"],
        },
        exclude:
        {
            active:     false,
            channels:   [],
            roles:      []
        }
    },

    flag: 
    {
        handled:        false,
        ignore:         false,
        defer:          true,
        access:         true,
        maintenance:    false
    },

    data: new SlashCommandBuilder()
    .setName('throwerror')
    .setDescription('Throws an error for testing error handling.')
    .addStringOption(option =>
    	option.setName('type')
    		.setDescription('Type of error to throw')
    		.setRequired(true)
    		.addChoices(
    			{ name: 'TypeError', value: 'TypeError' },
    			{ name: 'RangeError', value: 'RangeError' },
    			{ name: 'ReferenceError', value: 'ReferenceError' },
    			{ name: 'SyntaxError', value: 'SyntaxError' },
    			{ name: 'URIError', value: 'URIError' },
    			{ name: 'EvalError', value: 'EvalError' },
    			{ name: 'DatabaseError', value: 'DatabaseError' },
    			{ name: 'FileSystemError', value: 'FileSystemError' },
    			{ name: 'APIError', value: 'APIError' },
    			{ name: 'Generic Error', value: 'GenericError' },
    		)),
            
    execute: throwErrorCommand // Execution function
});


export default command;