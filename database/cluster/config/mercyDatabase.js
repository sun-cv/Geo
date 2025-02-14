import Directory        from '../../../environment/directory.json' with { type: 'json'}
import Database         from '../database.js';
import { shardTypes }   from '../../../source/command/mercy/tracker/definitions.js'
import { log, Text, Parser } from '../../../utility/index.js'


class MercyDatabase extends Database
{
    constructor()
    {
        super(Directory.cluster.mercy.path)

        create(this.database);
    }


    // Member
    loadMember(iMember)
    {
        return this.database.prepare(`SELECT * FROM MEMBER WHERE id = ?`).get(iMember.id);
    };

    createMember(iMember)
    {
        this.database.prepare(`INSERT INTO member (id, member) VALUES (?, ?)`).run(iMember.id, iMember.user.username);
        log.trace(`Successfully created database profile entry`);
    }
    

    // Account
    getAccounts(member)
    {
        return this.database.prepare("SELECT account FROM account WHERE id = ?").all(member.id);
    }

    loadAccountProfile(member, accountName)
    {
        return this.database.prepare("SELECT * FROM account WHERE id = ? and account = ?").get(member.id, accountName);
    }

    loadAccountData(member, accountName)
    {
        const buffer = this.database.prepare(`SELECT * FROM mercy WHERE id = ? AND account = ?`).all(member.id, accountName);
        log.trace(`found mercy for '${accountName}' (${buffer.length} records)`);
        
        Parser.mercy(buffer);
        
        return buffer;
    }

    createAccount(member, accountName)
    {
        this.database.prepare(`INSERT INTO account(id, member, account) VALUES (?, ?, ?)`).run(member.id, member.member, accountName)
        log.trace(`Successfully generated database  account entry for '${accountName}'`);

        for (const {shard, rarity} of shardTypes)
        {
            this.database.prepare(`INSERT INTO mercy (id, member, account, shard, rarity) VALUES (?, ?, ?, ?, ?)`).run(member.id, member.member, accountName, shard, rarity);
            log.trace(`Successfully generated ${Text.set(rarity).constrain(9)} ${Text.set(shard).constrain(7)} mercy for '${accountName}'`)
        }
    }
}



async function create(database)
{
    log.trace(`Establishing connection to database: Mercy`);

    database.exec
    (`
        CREATE TABLE IF NOT EXISTS member
        (
            id          TEXT        PRIMARY KEY,
            member      TEXT        NOT NULL,
            account     TEXT        DEFAULT '["main"]',
            data        TEXT        DEFAULT '{}',
            settings    TEXT        DEFAULT '{}',
            lastActive  TEXT        DEFAULT (DATETIME('now')),
            registered  TEXT        DEFAULT (DATETIME('now'))
        )
    `)

    database.exec
    (`
        CREATE TABLE IF NOT EXISTS account
        (
            id          TEXT        NOT NULL,
            member      TEXT        NOT NULL,
            account     TEXT        NOT NULL,
            main        INTEGER     DEFAULT 1,
            data        TEXT        DEFAULT '{}',
            settings    TEXT        DEFAULT '{}',
            lastActive  TEXT        DEFAULT (DATETIME('now')),
            registered  TEXT        DEFAULT (DATETIME('now')),
            PRIMARY KEY (id, account),
            FOREIGN KEY (id) REFERENCES member(id) ON DELETE CASCADE
        )
    `)

    database.exec
    (`
        CREATE TABLE IF NOT EXISTS mercy
        (
            id          TEXT        NOT NULL,
            member      TEXT        NOT NULL,
            account     TEXT        NOT NULL,            
            shard       TEXT        NOT NULL,
            rarity      TEXT        NOT NULL,
            count       INTEGER     DEFAULT 0,
            session     TEXT        DEFAULT NULL,
            lifetime    INTEGER     DEFAULT 0,
            lastAdded   INTEGER     DEFAULT 0,
            lastReset   TEXT        DEFAULT NULL,
            lastPull    TEXT        DEFAULT NULL,
            FOREIGN KEY (id, account) REFERENCES account(id, account) ON DELETE CASCADE
        )    
    `)

    database.exec
    (`
        CREATE TABLE IF NOT EXISTS session
        (
            id          TEXT        NOT NULL,
            member      TEXT        NOT NULL,
            account     TEXT        NOT NULL,
            pull        INTEGER     DEFAULT 0,
            reset       INTEGER     DEFAULT 0,
            champion    INTEGER     DEFAULT 0,
            session     TEXT        NOT NULL,
            timestamp   TEXT        DEFAULT (DATETIME('now')),
            PRIMARY KEY (id, account, session),
            FOREIGN KEY (id, account) REFERENCES account(id, account) ON DELETE CASCADE
        )
    `)

    database.exec
    (`
        CREATE TABLE IF NOT EXISTS pull
        (
            id          TEXT        NOT NULL,
            member      TEXT        NOT NULL,
            account     TEXT        NOT NULL,            
            shard       TEXT        NOT NULL,
            count       INTEGER     DEFAULT 0,
            session     TEXT        NOT NULL,
            timestamp   TEXT        DEFAULT (DATETIME('now')),
            FOREIGN KEY (id, account) REFERENCES account(id, account) ON DELETE CASCADE
            FOREIGN KEY (id, account, session) REFERENCES session(id, account, session) ON DELETE CASCADE
        )    
    `)

    database.exec
    (`
        CREATE TABLE IF NOT EXISTS reset
        (
            id          TEXT        NOT NULL,
            member      TEXT        NOT NULL,
            account     TEXT        NOT NULL,            
            shard       TEXT        NOT NULL,
            count       INTEGER     DEFAULT 0,
            session     TEXT        NOT NULL,
            timestamp   TEXT        DEFAULT (DATETIME('now')),
            FOREIGN KEY (id, account) REFERENCES account(id, account) ON DELETE CASCADE
            FOREIGN KEY (id, account, session) REFERENCES session(id, account, session) ON DELETE CASCADE
        )    
    `)

    database.exec
    (`
        CREATE TABLE IF NOT EXISTS champion
        (
            id          TEXT        NOT NULL,
            member      TEXT        NOT NULL,
            account     TEXT        NOT NULL,            
            shard       TEXT        NOT NULL,
            count       INTEGER     DEFAULT 0,
            champion    TEXT        NOT NULL,
            session     TEXT        NOT NULL,
            timestamp   TEXT        DEFAULT (DATETIME('now')),
            FOREIGN KEY (id, account) REFERENCES account(id, account) ON DELETE CASCADE
            FOREIGN KEY (id, account, session) REFERENCES session(id, account, session) ON DELETE CASCADE
        )    
    `)
}


export { MercyDatabase }