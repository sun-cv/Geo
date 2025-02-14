import directory from '../../environment/directory.json' with { type: 'json' };
import { log, Text } from '../../utility/index.js';
import { MercyDatabase } from './config/mercyDatabase.js';


class Cluster 
{
    constructor() 
    {
        this.databases   =
        {
            mercy: MercyDatabase,
        }

        this.system;
        this.mercy;
        this.clan;

        this.connect()

    }

    async connect() 
    {
        for (const database of Object.keys(this.databases)) 
        {
            try 
            {
                const dbPath = directory.cluster[database]?.path;
                if (!dbPath) 
                {
                    log.error(`Database path for ${Text.set(database).capitalize()} not found in configuration.`);
                    continue;
                }

                this[database] = new this.databases[database];
                log.admin(`Database online: ${Text.set(database).capitalize()}`);
            } 
            catch (error)
            {
                log.error(`Geo was unable to connect to database: ${Text.set(database).capitalize()}`, error);
            }
        }
        log.admin(`Database cluster online`);
    }



}

export { Cluster };
