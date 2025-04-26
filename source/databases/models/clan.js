import directory                                    from '#env/directory/path.json'    with { type: 'json' };
import Database                                     from './database.js';
import { log, Text, Parser, Timestamp, Serializer } from '#utils';



class Clan extends Database
{
    constructor()
    {
        super(directory.databases.clan.path)

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

    updateClan(clanData)
    {
        const data = Serializer.clanData(clanData)
        this.database.prepare(`UPDATE clan SET tier = ?, tag = ?, level = ?, role = ?, channel = ?, leadership = ?, member = ?, settings = ?, statistics = ?, recruitment = ? WHERE clan =?`).run(data.tier, data.tag, data.level, data.role, data.channel, data.leadership, data.member, data.settings, data.statistics, data.recruitment, data.clan)
        
        log.trace(`Successfully updated database entry: clan (${data.clan})`)
    }

    hasApplicationRecord(member) 
    {
        const data = this.database.prepare(`SELECT 1 FROM application WHERE status = ? AND member_id = ? LIMIT 1`).get('accepted', member.id);
        return !!data;
    }

    getApplications()
    {
        const data = this.database.prepare(`SELECT * FROM application WHERE status = ?`).all('pending')
        
        return data.map((data) => Parser.applicationData(data));
    }

    getApplicationRecord(member)
    {
        const data = this.database.prepare(`SELECT * FROM application WHERE status = ? AND member_id = ? ORDER BY timestamp DESC LIMIT 1`).get('accepted', member.id)
        
        return Parser.applicationData(data);
    }



    submitApplication(application) {
        const { system, member, account, request, clan, status, timestamp, ...nestedObjects }   = application;
        const { selection, clanboss, hydra, chimera, siege, cvc, data, setting, admin, meta}        = Object.fromEntries(Object.entries(nestedObjects).map(([key, value]) => [key, JSON.stringify(value)]));
    
        this.database.prepare(`INSERT INTO application(member, member_id, account, request, clan, status, selection, clanboss, hydra, chimera, siege, cvc, data, setting, admin, meta, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
            .run(member.username, member.id, account, request, clan, status, selection, clanboss, hydra, chimera, siege, cvc, data, setting, admin, meta, timestamp);
        
            log.trace(`Successfully submitted database entry: application '${account}'`);
    }

    updateApplication(application)
    {
        const { system, id, member, account, request, clan, status, timestamp, ...nestedObjects } = application;
        const { selection, clanboss, hydra, chimera, siege, cvc, data, setting, admin, meta} = Object.fromEntries(Object.entries(nestedObjects).map(([key, value]) => [key, JSON.stringify(value)]));
    
        this.database.prepare(`UPDATE application SET member = ?, member_id = ?, account = ?, request = ?, clan = ?, status = ?, selection = ?, clanboss = ?, hydra = ?, chimera = ?, siege = ?, cvc = ?, data = ?, setting = ?, admin = ?, meta = ?, timestamp = ? WHERE id = ?`)
            .run(member.username, member.id, account, request, clan, status, selection, clanboss, hydra, chimera, siege, cvc, data, setting, admin, meta, timestamp, application.id);

        log.trace(`Successfully updated database entry: application '${account}'`);
    }
    
    hasMember(application)
    {
        const data = this.database.prepare(`SELECT 1 FROM member WHERE id = ? LIMIT 1`).get( application.member.id);
        return !!data;
    }


    addMember(application) {
        const { system, id, member, account, request, clan, status, timestamp, ...nestedObjects }   = application;
        const { clanboss, hydra, chimera, siege, cvc, data, setting, admin}        = Object.fromEntries(Object.entries(nestedObjects).map(([key, value]) => [key, JSON.stringify(value)]));
    
        this.database.prepare(`INSERT INTO member(id, member, account, clan, clanboss, hydra, chimera, siege, cvc, data, setting, admin, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
            .run(member.id, member.username, account, clan, clanboss, hydra, chimera, siege, cvc, data, setting, admin, timestamp);
        
            log.trace(`Successfully submitted database entry: member '${account}'`);
    }

    updateMember(application)
    {
        const { system, id, member, account, request, clan, status, timestamp, ...nestedObjects }   = application;
        const { clanboss, hydra, chimera, siege, cvc, data, setting, admin}        = Object.fromEntries(Object.entries(nestedObjects).map(([key, value]) => [key, JSON.stringify(value)]));
    
        this.database.prepare(`UPDATE member SET member = ?, account = ?, clan = ?, clanboss = ?, hydra = ?, chimera = ?, siege = ?, cvc = ?, data = ?, setting = ?, admin = ?, timestamp = ? WHERE id = ?`)
            .run(member.username, account, clan, clanboss, hydra, chimera, siege, cvc, data, setting, admin, timestamp, member.id);
    
            log.trace(`Successfully submitted database entry: member '${account}'`);
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
            clanboss    TEXT        DEFAULT '{}',
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
            id          INTEGER     PRIMARY KEY AUTOINCREMENT,
            member      TEXT        NOT NULL,
            member_id   TEXT        NOT NULL,
            account     TEXT        NOT NULL,
            request     TEXT        NOT NULL,
            clan        TEXT        NOT NULL,
            status      TEXT        DEFAULT 'pending',
            selection   TEXT        DEFAULT '{}',
            clanboss    TEXT        DEFAULT '{}',
            hydra       TEXT        DEFAULT '{}',
            chimera     TEXT        DEFAULT '{}',
            siege       TEXT        DEFAULT '{}',
            cvc         TEXT        DEFAULT '{}',
            data        TEXT        DEFAULT '{}',
            setting     TEXT        DEFAULT '{}',
            admin       TEXT        DEFAULT '{}',
            meta        TEXT        DEFAULT '{}',
            timestamp   TEXT        DEFAULT (STRFTIME('%Y-%m-%dT%H:%M:%SZ', 'now')),
            FOREIGN KEY (clan) REFERENCES clan(clan) ON DELETE CASCADE
        )
    `)
}


export { Clan }