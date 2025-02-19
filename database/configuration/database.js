import SQLDatabase  from 'better-sqlite3';
import { log }      from '../../utility/index.js'


class Database 
{
    constructor(databasePath) {
        this.database = new SQLDatabase(databasePath);
        this.database.pragma('foreign_keys = ON');
    }

    execute(query) 
    {
        return this.database.exec(query);
    }

    run(query, params = []) 
    {
        return this.database.prepare(query).run(params);
    }

    get(query, params = []) 
    {
        return this.database.prepare(query).get(params);
    }

    all(query, params = []) 
    {
        return this.database.prepare(query).all(params);
    }

    transaction(callback) 
    {
        const transaction = this.database.transaction(callback);
        return transaction();
    }

    has(table, column, value)
    {
        const exists = !!this.database.prepare(`SELECT 1 FROM ${table} WHERE ${column} = ?`).get(value)
        log.trace(`data  ${exists ? 'found' : 'not found'} for ${value}`);
        return exists;
    }

    close() 
    {
        this.database.close();
    }
}

export default Database;
