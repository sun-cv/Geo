import Database                         from './database.js';
import Directory                        from '../../configuration/environment/directory.json'    with { type: 'json' };
import Shards                           from '../../source/data/mercy/shards.json'               with { type: 'json' };
import { log, Text, Parser, Timestamp } from '../../utility/index.js';


class Mercy extends Database
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
    
        // Update

    updateMember(member)
    {
        const accounts  = JSON.stringify(member.accounts);
        const data      = JSON.stringify(member.data);
        const settings  = JSON.stringify(member.settings);

        this.database.prepare(`UPDATE member SET accounts = ?, data = ?, settings = ?, lastActive = ? WHERE  id = ?`).run(accounts, data, settings, Timestamp.iso(), member.id)
    }

    // Account
    getAccounts(member)
    {
        return this.database.prepare("SELECT account FROM account WHERE id = ?").all(member.id);
    }

    loadAccountProfile(member, accountName)
    {
        const data = this.database.prepare("SELECT * FROM account WHERE id = ? and account = ?").get(member.id, accountName);
    
        return Parser.accountData(data)
    }

    loadAccountData(member, accountName)
    {
        const data = this.database.prepare(`SELECT * FROM mercy WHERE id = ? AND account = ?`).all(member.id, accountName);
        log.trace(`Found mercy for '${accountName}' (${data.length} records)`);
        
        
        return Parser.accountMercy(data);
    }
    
    loadAccountSession(member, accountName)
    {
        return this.database.prepare(`SELECT * FROM session WHERE id = ? AND account = ? AND session = ?`).get(member.id, accountName, Timestamp.session())
    }

    createAccount(member, accountName, main = 0)
    {
        this.database.prepare(`INSERT INTO account(id, member, account, main) VALUES (?, ?, ?, ?)`).run(member.id, member.member, accountName, Number(main))
        log.trace(`Successfully generated database entry: account '${accountName}'`);

        Object.entries(Shards.mercy).map(([ shard, rarities ]) => Object.keys(rarities).forEach((tier) => 
        {
            this.database.prepare(`INSERT INTO mercy (id, member, account, shard, rarity) VALUES (?, ?, ?, ?, ?)`).run(member.id, member.member, accountName, shard, tier);
            log.trace(`Successfully generated database entry: ${Text.set(tier).constrain(9)} ${Text.set(shard).constrain(7)} mercy for '${accountName}'`)
        }));
    }

    deleteAccount(member, accountName)
    {
        this.database.prepare(`DELETE FROM account WHERE id = ? AND account = ?`).run(member.id, accountName);
        log.trace(`Successfully deleted database entry for: account '${accountName}'`)
    }


        // Update

    updateAccount(account)
    {
        const data      = JSON.stringify(account.data);
        const settings  = JSON.stringify(account.settings)
        
        this.database.prepare(`UPDATE account SET main = ?, data = ?, settings = ?, lastActive = ? WHERE id = ? AND account = ?`).run(Number(account.main), data, settings, Timestamp.iso(), account.id, account.account );
        log.trace(`Successfully updated database entry: account`)

    }

    updateAccountMercy(account)
    {
        const dirtyEntries = Object.entries(Shards.mercy).flatMap(([ shard, rarities ]) => Object.keys(rarities).filter((rarity) => account.flag.mercy[shard][rarity].dirty.get()).map((rarity) => ({shard, rarity})));

        for (const {shard, rarity} of dirtyEntries)
        {
            const mercy = account.mercy[shard][rarity];
            
            this.database.prepare(`UPDATE mercy SET total = ?, session = ?, lifetime = ?, lastAdded = ?, lastReset = ?, lastChampion = ? WHERE id = ? AND account = ? AND shard = ? AND rarity = ?`).run(mercy.total, Timestamp.session(), mercy.lifetime, mercy.lastAdded, mercy.lastReset, mercy.lastChampion, account.id, account.account, shard, rarity);
            log.trace(`Successfully updated database entry: ${Text.set(rarity).constrain(9)} ${Text.set(shard).constrain(7)}`)
            account.flag.mercy[shard][rarity].dirty.clear();
        }
    }


    updateAccountSession(account)
    {
        const exists = !!this.database.prepare(`SELECT session FROM session WHERE id = ? AND account = ? AND session = ?`).get(account.id, account.account, account.session.session);
        
        if (exists)
        {
            this.database.prepare(`UPDATE session SET pull = ?, reset = ?, champion = ?, timestamp = ? WHERE id = ? AND account = ? AND session = ?`).run(Number(account.session.pull), Number(account.session.reset), Number(account.session.champion), Timestamp.iso(), account.id, account.account, account.session.session);
            log.trace(`Successfully updated database entry: session`)
            return;
        }
        this.database.prepare(`INSERT INTO session (id, member, account, pull, reset, champion, session) VALUES (?, ?, ?, ?, ?, ?, ?)`).run(account.id, account.member, account.account, Number(account.session.pull), Number(account.session.reset), Number(account.session.champion), account.session.session);
        log.trace(`Successfully created database entry: session`)

    }

    updateAccountLogs(account)
    {
        Object.entries(account.session.log).map(([ type, array ]) => array.filter((entry) => entry.write).forEach((entry) => 
        {
            entry.write = false;
            logHandler[type](this.database, account, entry);
        }));
        log.trace(`Successfully updated database logs`)
    }

    getAccountLogs(account)
    {
        const logs      = {};

        logs.pull       = this.database.prepare(`SELECT * FROM pull     WHERE id = ? AND account = ?`).all(account.id, account.account)
        logs.reset      = this.database.prepare(`SELECT * FROM reset    WHERE id = ? AND account = ?`).all(account.id, account.account)
        logs.champion   = this.database.prepare(`SELECT * FROM champion WHERE id = ? AND account = ?`).all(account.id, account.account)

        return logs;
    }

}


const logHandler = 
{
    pull:       ((database, account, log) => { database.prepare(`INSERT INTO pull (id, member, account, shard, count, session) VALUES (?, ?, ?, ?, ?, ?)`).run(account.id, account.member, account.account, log.shard, log.count, log.session) }),
    reset:      ((database, account, log) => { database.prepare(`INSERT INTO reset (id, member, account, shard, rarity, total, session) VALUES (?, ?, ?, ?, ?, ?, ?)`).run(account.id, account.member, account.account, log.shard, log.rarity, log.total, log.session) }),
    champion:   ((database, account, log) => { database.prepare(`INSERT INTO champion (id, member, account, shard, rarity, total, champion, session) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`).run(account.id, account.member, account.account, log.shard, log.rarity, log.total, log.champion, log.session) })
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
            accounts    TEXT        DEFAULT '["Main"]',
            data        TEXT        DEFAULT '{}',
            settings    TEXT        DEFAULT '{}',
            lastActive  TEXT        DEFAULT (STRFTIME('%Y-%m-%dT%H:%M:%SZ', 'now')),
            registered  TEXT        DEFAULT (STRFTIME('%Y-%m-%dT%H:%M:%SZ', 'now'))
        )
    `)

    database.exec
    (`
        CREATE TABLE IF NOT EXISTS account
        (
            id          TEXT        NOT NULL,
            member      TEXT        NOT NULL,
            account     TEXT        NOT NULL,
            main        INTEGER     DEFAULT 0,
            data        TEXT        DEFAULT '{}',
            settings    TEXT        DEFAULT '{}',
            lastActive  TEXT        DEFAULT (STRFTIME('%Y-%m-%dT%H:%M:%SZ', 'now')),
            registered  TEXT        DEFAULT (STRFTIME('%Y-%m-%dT%H:%M:%SZ', 'now')),
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
            total       INTEGER     DEFAULT 0,
            session     TEXT        DEFAULT NULL,
            lifetime    INTEGER     DEFAULT 0,
            lastAdded   INTEGER     DEFAULT 0,
            lastReset   TEXT        DEFAULT NULL,
            lastChampion TEXT       DEFAULT NULL,
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
            timestamp   TEXT        DEFAULT (STRFTIME('%Y-%m-%dT%H:%M:%SZ', 'now')),
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
            count       INTEGER     NOT NULL,
            session     TEXT        NOT NULL,
            timestamp   TEXT        DEFAULT (STRFTIME('%Y-%m-%dT%H:%M:%SZ', 'now')),
            FOREIGN KEY (id, account) REFERENCES account(id, account) ON DELETE CASCADE,
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
            rarity      TEXT        NOT NULL,            
            total       INTEGER     NOT NULL,
            session     TEXT        NOT NULL,
            timestamp   TEXT        DEFAULT (STRFTIME('%Y-%m-%dT%H:%M:%SZ', 'now')),
            FOREIGN KEY (id, account) REFERENCES account(id, account) ON DELETE CASCADE,
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
            rarity      TEXT        NOT NULL,
            total       INTEGER     default 0,
            champion    TEXT        NOT NULL,
            session     TEXT        NOT NULL,
            timestamp   TEXT        DEFAULT (STRFTIME('%Y-%m-%dT%H:%M:%SZ', 'now')),
            FOREIGN KEY (id, account) REFERENCES account(id, account) ON DELETE CASCADE,
            FOREIGN KEY (id, account, session) REFERENCES session(id, account, session) ON DELETE CASCADE
        )    
    `)
}


export { Mercy }