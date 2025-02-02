const { db } = require('../../database/database');
const { Text } = require('../classes/Text');
const { Command, Button, Menu, Task, Default, Modal } = require('./event');
const { EventEmitter } = require('events');


class Log {
	constructor() {
		if (Log.instance) {
			return Log.instance;
		}
		Log.instance = this;

		this.emitter = new EventEmitter();
		this.events = new Map();

	}

	async event(data, type) {
		await processEvent(this.events, data, type);
	}

}

async function processEvent(events, data, type) {
	try {

		const event = await getEvent(events, data, type);
		if (event.status === 'new' && type === 'interaction') return;

		await event.tracer.endTime();
		await logEvent(events, event);
		await writeEvent(event);
		await clearEvent(events, event);
	}
	catch (error) {
		console.log(error);
	}
}

async function getEvent(events, data, type) {

	const key = data.id;

	if (!events.has(key)) {
		const newEvent = await createEvent(data, type);
		events.set(key, newEvent);
		return newEvent;
	}
	const event = events.get(key);
	event.status = 'success';
	return event;
}

async function createEvent(data, type) {

	if (type === 'interaction') {

		if (data.isCommand()) return new Command(data);
		if (data.isButton()) return new Button(data);
		if (data.isAnySelectMenu()) return new Menu(data);
		if (data.isModalSubmit()) return new Modal(data);
		return new Default();
	}
	else {
		return new Task(data);
	}
}

async function logEvent(events, event) {
	try {

		const { member, command, parameters, button, menu, values, message, modal, tracer, time, cron } = event;

		if (command) {
			console.log(`${time.hour} - ${Text.fit({ string: tracer.responseTime, limit: 6, pad: true })}: ${member.username} used ${parameters}`);
		}
		if (button) {
			console.log(`${time.hour} - ${Text.fit({ string: tracer.responseTime, limit: 6, pad: true })}: ${member.username} is navigating ${button.customId}`);
		}
		if (menu) {
			console.log(`${time.hour} - ${Text.fit({ string: tracer.responseTime, limit: 6, pad: true })}: ${member.username} selected ${values}`);
		}
		if (modal) {
			console.log(`${time.hour} - ${Text.fit({ string: tracer.responseTime, limit: 6, pad: true })}: ${member.username} submitted modal`);
		}
		if (message) {
			console.log(`${time.hour}: ${member.name} ${message.filter} > ${message.content} `);
		}

		if (cron) {
			if (event.run === false) {
				console.log(`Running ${event.name}..`);
				event.run = true;
				return;
			}

			console.log(`${time.hour}: ${event.name} was executed successfully in ${event.tracer.responseTime}. Next execution time: ${event.nextExecution}`);
			event.run = false;
		}
	}
	catch (error) {
		console.log(error);
	}
}

async function writeEvent(event) {

	const { interaction, command, member, parameters, data, task, tracer, time } = event;

	const queries = [];
	let query;

	if (command) {
		queries.push({
			table: 'command_log',
			variables: '(guild_id, channel_id, user_id, username, command, output, response_time, time, timestamp)',
			values: [interaction.guildId, interaction.channelId, member.id, member.username, parameters, data.output || '', tracer.responseTime, time.stamp, time.iso] });
	}

	if (task) {

		if (task.info.type === 'system') {
			queries.push({
				update: true,
				where: [
					{ key: 'id', value: task.info.id },
					{ key: 'task_name', value: task.info.name },
				],
				table: 'tasks_system',
				variables: '(scheduled_at, last_execution, next_execution, response_time, failed_at)',
				values: [task.timestamp.scheduledAt, task.timestamp.lastExecution, task.timestamp.nextExecution, task.timestamp.responseTime, task.timestamp.failedAt] });
		}
	}

	for (const queryInfo of queries) {

		const placeholders = '?'.repeat(queryInfo.values.length).split('').join(', ');
		let params;

		if (queryInfo.update === true) {

			const pairs = queryInfo.variables.slice(1, -1).split(', ').map((v) => `${v} = ?`).join(', ');
			const whereClause = queryInfo.where.map(condition => `${condition.key} = ?`).join(' AND ');

			query = `UPDATE ${queryInfo.table} SET ${pairs} WHERE ${whereClause}`;

			params = [...queryInfo.values, ...queryInfo.where.map(condition => condition.value)];

		}
		else {

			query = `INSERT INTO ${queryInfo.table} ${queryInfo.variables} VALUES(${placeholders})`;
			params = queryInfo.values;

		}
		try {

			await db.run(query, params);
		}
		catch (error) {
			console.log(error);
		}
	}
}

async function clearEvent(events, event) {
	try {
		const key = event.id;
		if (event.status === 'success') {
			events.delete(key);
		}
	}
	catch (error) {
		console.log(error);
	}
}

const log = new Log();

module.exports = {
	log,
};