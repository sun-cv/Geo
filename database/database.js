import { log } from '../utility/index.js'

async function createSystemDatabase(database)
{
    log.trace(`Checking/creating tables...`);

    database.exec
    (`
        CREATE TABLE IF NOT EXISTS task_kappa
        (
            kappa       INTEGER     PRIMARY KEY AUTOINCREMENT,
            id          INTEGER     NOT NULL,
            member      TEXT        NOT NULL,
            count       INTEGER,
            timestamp   TEXT        NOT NULL            
        )
    `)
}


async function createMercyDatabase(database)
{
    log.trace(`Checking/creating tables...`);

    database.exec
    (`
        CREATE TABLE IF NOT EXISTS account
        (
            id          INTEGER     NOT NULL,
            member      TEXT        NOT NULL,
            account     TEXT        NOT NULL,
            main        INTEGER     DEFAULT 0,
            data        TEXT,
            settings    TEXT,
            lastActive  TEXT,
            registered  TEXT        DEFAULT (DATETIME('now'))
        )
    `)

    database.exec
    (`
        CREATE TABLE IF NOT EXISTS data
        (
            id          INTEGER     NOT NULL,
            member      TEXT        NOT NULL,
            account     TEXT        NOT NULL,            
            shard       TEXT        NOT NULL,
            count       INTEGER     DEFAULT 0,
            lifetime    INTEGER     DEFAULT 0,
            lastAdded   INTEGER     DEFAULT 0,
            lastPulled  TEXT,
            lastReset   TEXT,
            FOREIGN KEY (member, account) REFERENCES account(member, account) ON DELETE CASCADE

        )    
    `)

    database.exec
    (`
        CREATE TABLE IF NOT EXISTS pull
        (
            id          INTEGER     NOT NULL,
            member      TEXT        NOT NULL,
            account     TEXT        NOT NULL,            
            shard       TEXT        NOT NULL,
            count       INTEGER     DEFAULT 0,
            session     TEXT,
            timestamp   TEXT,
            FOREIGN KEY (member, account) REFERENCES account(member, account) ON DELETE CASCADE
        )    
    `)

    database.exec
    (`
        CREATE TABLE IF NOT EXISTS reset
        (
            id          INTEGER     NOT NULL,
            member      TEXT        NOT NULL,
            account     TEXT        NOT NULL,            
            shard       TEXT        NOT NULL,
            count       INTEGER     DEFAULT 0,
            champion    TEXT,
            session     TEXT,
            timestamp   TEXT,
            FOREIGN KEY (member, account) REFERENCES account(member, account) ON DELETE CASCADE
        )    
    `)
}


async function createClanDatabase()
{
    log.trace(`Checking/creating tables...`);
}

export { createSystemDatabase, createMercyDatabase, createClanDatabase }