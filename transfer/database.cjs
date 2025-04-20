const sqlite3 = require('sqlite3').verbose();
const util = require('util');

const db = new sqlite3.Database('./database.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
	if (err) {
		console.error(err.message);
	}
	console.log('Geo Connected to the database.');

});

db.run = util.promisify(db.run);
db.get = util.promisify(db.get);
db.all = util.promisify(db.all);

// Create Geo DB

async function createDatabase() {

	/**
 	* COMMAND LOG
 	*/

	await db.run(`CREATE TABLE IF NOT EXISTS command_log (
		guild_id TEXT NOT NULL,
		channel_id TEXT NOT NULL,
		user_id TEXT NOT NULL,
		username TEXT NOT NULL,
		command TEXT,
		output TEXT,
		error TEXT,
		response_time TEXT,
		time TEXT,
		timestamp TEXT NOT NULL
)`, (error) => {
		if (error) {
			console.error(error.message);
		}
	});

	/**
 	* MERCY TRACKER V2.0
 	*/

	await db.run(`CREATE TABLE IF NOT EXISTS mercy_tracker_accounts (
		id TEXT NOT NULL,
		member TEXT NOT NULL,
		name TEXT NOT NULL,
		main TEXT NOT NULL,
		data TEXT,
		template TEXT,
		lastActive TEXT,
		registered TEXT
	)`, (error) => {
		if (error) {
			console.error(error.message);
		}
	});

	await db.run(`CREATE TABLE IF NOT EXISTS mercy_tracker_data (
		id TEXT NOT NULL,
		member TEXT NOT NULL,
		name TEXT NOT NULL,
		shard TEXT NOT NULL,
		count INTEGER DEFAULT 0,
		totalCount INTEGER DEFAULT 0,
		lastAdded INTEGER DEFAULT 0,
		lastPulled TEXT,
		lastReset TEXT
	)`, (error) => {
		if (error) {
			console.error(error.message);
		}
	});

	await db.run(`CREATE TABLE IF NOT EXISTS mercy_tracker_champions (
		id TEXT NOT NULL,
		member TEXT NOT NULL,
		name TEXT NOT NULL,
		shard TEXT NOT NULL,
		champion TEXT NOT NULL,
		lastCount TEXT NOT NULL,
		date TEXT NOT NULL,
		timestamp TEXT NOT NULL

	)`, (error) => {
		if (error) {
			console.error(error.message);
		}
	});

	/**
	 * APPLICATION MANAGER
	 */

	await db.run(`CREATE TABLE IF NOT EXISTS application_manager (
		application INTEGER PRIMARY KEY AUTOINCREMENT,
		id TEXT,
		member TEXT,
		account TEXT,
		clanBoss TEXT,
		hydra TEXT,
		clan TEXT,
		response TEXT,
		status TEXT DEFAULT pending,
		timestamp TEXT

	)`, (error) => {
		if (error) {
			console.error(error.message);
		}
	});

	await db.run(`CREATE TABLE IF NOT EXISTS application_manager_clans (
		tier TEXT,
		name TEXT,
		leadership TEXT,
		data TEXT,
		member TEXT,
		clanBoss TEXT,
		hydra TEXT,
		cvc TEXT,
		siege TEXT,
		options TEXT
		
		)`, (error) => {
		if (error) {
			console.error(error.message);
		}
	});

	/**
	 * TASKS
	 */

	await db.run(`CREATE TABLE IF NOT EXISTS tasks_system (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		name TEXT,
		arguments TEXT,
		cron TEXT,
		data TEXT
	)`, (error) => {
		if (error) {
			console.error(error.message);
		}
	});

	/**
 	* Golden Kappa
 	*/

	await db.run(`CREATE TABLE IF NOT EXISTS tasks_golden_kappa (
	kappa INTEGER PRIMARY KEY AUTOINCREMENT,
	id TEXT,
	username TEXT,
	timestamp TEXT NOT NULL
)`, (error) => {
		if (error) {
			console.error(error.message);
		}
	});

}

createDatabase();

module.exports = db;

