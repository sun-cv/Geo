import directory from '../environment/directory.json' with { type: 'json'}
import Database from 'better-sqlite3';

import { log } from '../utility/index.js'

class Cluster
{
    static instance = null;

    constructor()
    {
        if (Cluster.instance) return Cluster.instance;

        Cluster.instance   = this;

        this.databases      = ['system', 'mercy', 'clan'];

        this.system;
        this.mercy;
        this.clan;

    }

    async connect()
    {
        for (const database of this.cluster)
        {
            try 
            {
                this[database] = new Database(directory.cluster[database].path);
                log.admin(`Geo connected to ${database} database`)
            } 
            catch (error) 
            {
                log.error(`Geo was unable to connect to database: ${database}`);
            }
            this.create(database);
        }
    }

    async create(database)
    {

        try 
        {
             loader = databaseCreate[database];
            loader(this[database])
        } 
        catch (error) 
        {
            log.error(`Geo was unable to confirm tables exist in ${database}'s database`);
        }

    }
    
    databaseCreate = 
    {
        system: createSystemDatabase,
        mercy:  createMercyDatabase,
        clan:   createClanDatabase
    }


}

const cluster = new Cluster;

export { cluster }