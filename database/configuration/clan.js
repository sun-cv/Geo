import Database                         from './database.js';
import Directory                        from '../../configuration/environment/directory.json'    with { type: 'json' };
import { log, Text, Parser, Timestamp } from '../../utility/index.js';



class Clan extends Database
{
    constructor()
    {
        super(Directory.cluster.clan.path)

        create(this.database);
    }

    getClans()
    {
        return this.database.prepare(`SELECT clan FROM clan`).all().map((row) => { return row.clan });
    }

    loadClan(clanName)
    {
        const data = this.database.prepare(`SELECT * FROM clan WHERE clan = ?`).get(clanName);
        return Parser.clanData(data);
    }

}

async function create(database)
{
    log.debug(`Establishing connection to database: Clan`);

    database.exec
    (`
        CREATE TABLE IF NOT EXISTS clan
        (
            clan        TEXT        PRIMARY KEY,
            tier        TEXT        DEFAULT 0,
            tag         TEXT        NOT NULL,
            level       INTEGER     DEFAULT 0,
            role        TEXT        NOT NULL,
            channel     TEXT        DEFAULT '{}',
            leadership  TEXT        DEFAULT '{}',
            member      TEXT        DEFAULT '{}',
            settings    TEXT        DEFAULT '{}',
            statistics  TEXT        DEFAULT '{}',
            recruitment TEXT        DEFAULT '{}'
        )
    `)

    database.exec
    (`
        CREATE TABLE IF NOT EXISTS member
        (
            id          TEXT        NOT NULL,
            member      TEXT        NOT NULL,
            account     TEXT        NOT NULL,
            clan        TEXT        NOT NULL,
            clanBoss    TEXT        DEFAULT '{}',
            hydra       TEXT        DEFAULT '{}',
            chimera     TEXT        DEFAULT '{}',
            siege       TEXT        DEFAULT '{}',
            cvc         TEXT        DEFAULT '{}',
            data        TEXT        DEFAULT '{}',
            setting     TEXT        DEFAULT '{}',
            admin       TEXT        DEFAULT '{}',
            timestamp   TEXT        DEFAULT (STRFTIME('%Y-%m-%dT%H:%M:%SZ', 'now')),
            FOREIGN KEY (clan) REFERENCES clan(clan) ON DELETE CASCADE
        )
    `)

    database.exec
    (`
        CREATE TABLE IF NOT EXISTS application
        (
            application INTEGER     PRIMARY KEY AUTOINCREMENT,
            id          TEXT        NOT NULL,
            member      TEXT        NOT NULL,
            account     TEXT        NOT NULL,
            request     TEXT        NOT NULL,
            selection   TEXT        NOT NULL,
            status      TEXT        DEFAULT 'pending',
            clan        TEXT        DEFAULT '{}',
            clanBoss    TEXT        DEFAULT '{}',
            hydra       TEXT        DEFAULT '{}',
            chimera     TEXT        DEFAULT '{}',
            siege       TEXT        DEFAULT '{}',
            cvc         TEXT        DEFAULT '{}',
            data        TEXT        DEFAULT '{}',
            setting     TEXT        DEFAULT '{}',
            admin       TEXT        DEFAULT '{}',
            timestamp   TEXT        DEFAULT (STRFTIME('%Y-%m-%dT%H:%M:%SZ', 'now')),
            FOREIGN KEY (clan) REFERENCES clan(clan) ON DELETE CASCADE
        )
    `)
}


export { Clan }