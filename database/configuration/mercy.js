import Database                         from './database.js';
import directory                        from '../../env/directory/path.json'    with { type: 'json' };
import Shards                           from '../../source/data/mercy/shards.json'  with { type: 'json' };
import { log, Text, Parser, Timestamp, MercyUtil, Snowflake, Serializer } from '../../utility/index.js';


class Mercy extends Database
{
    constructor()
    {
        super(directory.database.mercy.path)

        create(this.database);
    }

    // TRANSFER - DELETE
    hasMember(iMember)
    {
        return this.database.prepare(`SELECT * FROM MEMBER WHERE member_id = ?`).get(iMember.id);
    };

    createMemberTransfer(iMember, registered)
    {
        this.database.prepare(`INSERT INTO member (member_id, username, registered) VALUES (?, ?, ?)`).run(iMember.id, iMember.user.username, registered);
        log.trace(`Successfully created database profile entry`);
    }

    createAccountTransfer(member, accountName, main = 0, registered )
    {
        const account_id = Snowflake.generate();

        this.database.prepare(`INSERT INTO account(member_id, account_id, username, name, main, registered) VALUES (?, ?, ?, ?, ?, ?)`).run(member.id, account_id, member.user.username, accountName, Number(main), registered)
        log.trace(`Successfully generated database entry: account '${accountName}'`);

        MercyUtil.forEachShard((shard, rarity) =>
        {
            this.database.prepare(`INSERT INTO mercy(member_id, account_id, username, name, source, rarity) VALUES (?, ?, ?, ?, ?, ?)`).run(member.id, account_id, member.user.username, accountName, shard, rarity);
            log.trace(`Successfully generated database entry: ${Text.set(rarity).constrain(9)} ${Text.set(shard).constrain(7)} mercy for '${accountName}'`)
        }, { prism: true})

        // this.database.prepare(`INSERT INTO session (member_id, account_id, pull, reset, champion, session) VALUES (?, ?, ?, ?, ?, ?)`).run(member.id, account_id, 0, 0, 0, Timestamp.session());
        // log.trace(`Successfully created database entry: session`)

        return account_id;
    }

        loadAccountDataTransfer(member, account_id)
    {
        const data = this.database.prepare(`SELECT * FROM mercy WHERE member_id = ? AND account_id = ?`).all(member.id, account_id);

        log.trace(`Found mercy data (${data.length} records)`);

        return Parser.accountMercy(data);
    }



    updateAccountMercyTransfer(account)
    {
         const dirtyEntries = Object.entries(Shards.mercy).flatMap(([ shard, rarities ]) => Object.keys(rarities).map((rarity) => ({shard, rarity})));

        for (const {shard, rarity} of dirtyEntries)
        {
            const mercy = account.mercy[shard][rarity];
        
            this.database.prepare(`UPDATE mercy SET username = ?, name = ?, total = ?, lifetime = ?, lastAdded = ?, lastReset = ?, lastChampion = ? WHERE member_id = ? AND account_id = ? AND source = ? AND rarity = ?`).run(account.member.username, account.name, mercy.total, mercy.lifetime, mercy.lastAdded, mercy.lastReset, mercy.lastChampion, account.member.id, account.id, shard, rarity);
            
            log.trace(`Successfully updated database entry: ${Text.set(rarity).constrain(9)} ${Text.set(shard).constrain(7)}`)
            
            account.flag.mercy[shard][rarity].dirty.clear();
        }
    }
    

    // Member

    loadMember(iMember)
    {
        const data = this.database.prepare(`SELECT * FROM MEMBER WHERE member_id = ?`).get(iMember.id);
        return Parser.memberData(data);
    };

    createMember(iMember)
    {
        this.database.prepare(`INSERT INTO member (member_id, username) VALUES (?, ?)`).run(iMember.id, iMember.user.username);
        log.trace(`Successfully created database profile entry`);
    }
    
    updateMember(member)
    {
        const { data, settings, records } = Serializer.memberData(member);

        this.database.prepare(`UPDATE member SET data = ?, settings = ?, records = ?, lastActive = ? WHERE  member_id = ?`).run(data, settings, records, Timestamp.iso(), member.id)
    }

    // Account
    getAccounts(member)
    {
        return this.database.prepare("SELECT account_id FROM account WHERE member_id = ?").all(member.id);
    }

    loadAccountProfile(member, account_id)
    {

        const data  = this.database.prepare("SELECT * FROM account WHERE member_id = ? and account_id = ?").get(member.id, account_id);
    
        log.trace(`Successfully found account data ${data.name}`)

        return Parser.accountData(data, member)
    }

    loadAccountData(member, account_id)
    {
        const data = this.database.prepare(`SELECT * FROM mercy WHERE member_id = ? AND account_id = ?`).all(member.id, account_id);

        log.trace(`Successfully found mercy data (${data.length} records)`);

        return Parser.accountMercy(data);
    }
    
    loadAccountSession(member, account_id)
    {
        const data = this.database.prepare(`SELECT * FROM session WHERE member_id = ? AND account_id = ? ORDER BY timestamp DESC LIMIT 1`).get(member.id, account_id)
        
        if (data) log.trace(`Successfully found session data (${Object.keys(data).length} records)`);
        
        return data
    }

    createAccount(member, accountName, main = 0)
    {
        const account_id = Snowflake.generate();

        this.database.prepare(`INSERT INTO account(member_id, account_id, username, name, main) VALUES (?, ?, ?, ?, ?)`).run(member.id, account_id, member.username, accountName, Number(main))
        log.trace(`Successfully generated database entry: account '${accountName}'`);

        MercyUtil.forEachShard((shard, rarity) =>
        {
            this.database.prepare(`INSERT INTO mercy(member_id, account_id, username, name, source, rarity) VALUES (?, ?, ?, ?, ?, ?)`).run(member.id, account_id, member.username, accountName, shard, rarity);
            log.trace(`Successfully generated database entry: ${Text.set(rarity).constrain(9)} ${Text.set(shard).constrain(7)} mercy for '${accountName}'`)
        }, { prism: true})

        return account_id;
    }

    deleteAccount(member, account_id)
    {
        this.database.prepare(`DELETE FROM account WHERE member_id = ? AND account_id = ?`).run(member.id, account_id);
        log.trace(`Successfully deleted database account entry`)
    }


    // Update
    updateAccount(account)
    {
        const { data, settings, records } = Serializer.accountData(account);
        
        this.database.prepare(`UPDATE account SET username = ?, name = ?, main = ?, data = ?, settings = ?, records = ?, lastActive = ? WHERE member_id = ? AND account_id = ?`).run(account.member.username, account.name, Number(account.main), data, settings, records, Timestamp.iso(), account.member.id, account.id );
        log.trace(`Successfully updated database account entry`)
    }


    updateAccountMercy(account)
    {
         const dirtyEntries = Object.entries(Shards.mercy).flatMap(([ shard, rarities ]) => Object.keys(rarities).filter((rarity) => account.flag.mercy[shard][rarity].dirty.get()).map((rarity) => ({shard, rarity})));

        for (const {shard, rarity} of dirtyEntries)
        {
            const mercy = account.mercy[shard][rarity];
            
            this.database.prepare(`UPDATE mercy SET username = ?, name = ?, total = ?, session = ?, lifetime = ?, lastAdded = ?, lastReset = ?, lastChampion = ? WHERE member_id = ? AND account_id = ? AND source = ? AND rarity = ?`).run(account.member.username, account.name, mercy.total, Timestamp.session(), mercy.lifetime, mercy.lastAdded, mercy.lastReset, mercy.lastChampion, account.member.id, account.id, shard, rarity);
            log.trace(`Successfully updated database entry: ${Text.set(rarity).constrain(9)} ${Text.set(shard).constrain(7)}`)
            account.flag.mercy[shard][rarity].dirty.clear();
        }
    }
    

    updateAccountSession(account)
    {
        const exists = !!this.database.prepare(`SELECT session FROM session WHERE member_id = ? AND account_id = ? AND session = ?`).get(account.member.id, account.id, account.session.session);
        
        if (exists)
        {
            this.database.prepare(`UPDATE session SET pull = ?, reset = ?, champion = ?, timestamp = ? WHERE member_id = ? AND account_id = ? AND session = ?`).run(Number(account.session.pull.get()), Number(account.session.reset.get()), Number(account.session.champion.get()), Timestamp.iso(), account.member.id, account.id, account.session.session);
            log.trace(`Successfully updated database entry: session`)
            return;
        }
        this.database.prepare(`INSERT INTO session (member_id, account_id, pull, reset, champion, session) VALUES (?, ?, ?, ?, ?, ?)`).run(account.member.id, account.id, Number(account.session.pull.get()), Number(account.session.reset.get()), Number(account.session.champion.get()), account.session.session);
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

        logs.pull       = this.database.prepare(`SELECT * FROM pull     WHERE member_id = ? AND account_id = ?`).all(account.member.id, account.id)
        logs.reset      = this.database.prepare(`SELECT * FROM reset    WHERE member_id = ? AND account_id = ?`).all(account.member.id, account.id)
        logs.champion   = this.database.prepare(`SELECT * FROM champion WHERE member_id = ? AND account_id = ?`).all(account.member.id, account.id)

        return logs;
    }

}


const logHandler = 
{
    pull:       ((database, account, log) => { database.prepare(`INSERT INTO pull       (member_id, account_id, source, count, session) VALUES (?, ?, ?, ?, ?)`)                        .run(account.member.id, account.id, log.source, log.count, log.session) }),
    reset:      ((database, account, log) => { database.prepare(`INSERT INTO reset      (member_id, account_id, source, rarity, total, session) VALUES (?, ?, ?, ?, ?, ?)`)             .run(account.member.id, account.id, log.source, log.rarity, log.total, log.session) }),
    champion:   ((database, account, log) => { database.prepare(`INSERT INTO champion   (member_id, account_id, source, rarity, total, champion, session) VALUES (?, ?, ?, ?, ?, ?, ?)`).run(account.member.id, account.id, log.source, log.rarity, log.total, log.champion, log.session) })
}

async function create(database)
{
    log.trace(`Establishing connection to database: Mercy`);

    database.exec(`
        CREATE TABLE IF NOT EXISTS member 
        (
            member_id       TEXT PRIMARY KEY,
            username        TEXT NOT NULL,
            data            TEXT DEFAULT '{}',
            settings        TEXT DEFAULT '{}',
            records         TEXT DEFAULT '{}',
            lastActive      TEXT DEFAULT (STRFTIME('%Y-%m-%dT%H:%M:%SZ', 'now')),
            registered      TEXT DEFAULT (STRFTIME('%Y-%m-%dT%H:%M:%SZ', 'now'))
        )
    `);

    database.exec(`
        CREATE TABLE IF NOT EXISTS account 
        (
            member_id       TEXT NOT NULL,
            account_id      TEXT NOT NULL,
            username        TEXT NOT NULL,
            name            TEXT NOT NULL,
            main            INTEGER DEFAULT 0,
            data            TEXT DEFAULT '{}',
            settings        TEXT DEFAULT '{}',
            records         TEXT DEFAULT '{}',
            lastActive      TEXT DEFAULT (STRFTIME('%Y-%m-%dT%H:%M:%SZ', 'now')),
            registered      TEXT DEFAULT (STRFTIME('%Y-%m-%dT%H:%M:%SZ', 'now')),
            PRIMARY KEY (member_id, account_id),
            FOREIGN KEY (member_id) REFERENCES member(member_id) ON DELETE CASCADE
        )
    `);

    database.exec(`
        CREATE TABLE IF NOT EXISTS mercy 
        (
            member_id       TEXT NOT NULL,
            account_id      TEXT NOT NULL,
            username        TEXT NOT NULL,
            name            TEXT NOT NULL,            
            source          TEXT NOT NULL,
            rarity          TEXT NOT NULL,
            total           INTEGER DEFAULT 0,
            session         TEXT DEFAULT NULL,
            lifetime        INTEGER DEFAULT 0,
            lastAdded       INTEGER DEFAULT 0,
            lastReset       TEXT DEFAULT NULL,
            lastChampion    TEXT DEFAULT NULL,
            FOREIGN KEY (member_id, account_id) REFERENCES account(member_id, account_id) ON DELETE CASCADE ON UPDATE CASCADE
        )
    `);

    database.exec(`
        CREATE TABLE IF NOT EXISTS session 
        (
            member_id       TEXT NOT NULL,
            account_id      TEXT NOT NULL,
            pull            INTEGER DEFAULT 0,
            reset           INTEGER DEFAULT 0,
            champion        INTEGER DEFAULT 0,
            session         TEXT NOT NULL,
            timestamp       TEXT DEFAULT (STRFTIME('%Y-%m-%dT%H:%M:%SZ', 'now')),
            PRIMARY KEY (member_id, account_id, session),
            FOREIGN KEY (member_id, account_id) REFERENCES account(member_id, account_id) ON DELETE CASCADE ON UPDATE CASCADE
        )
    `);

    database.exec(`
        CREATE TABLE IF NOT EXISTS pull 
        (
            member_id       TEXT NOT NULL,
            account_id      TEXT NOT NULL,            
            source          TEXT NOT NULL,
            count           INTEGER NOT NULL,
            session         TEXT NOT NULL,
            timestamp       TEXT DEFAULT (STRFTIME('%Y-%m-%dT%H:%M:%SZ', 'now')),
            FOREIGN KEY (member_id, account_id) REFERENCES account(member_id, account_id) ON DELETE CASCADE ON UPDATE CASCADE,
            FOREIGN KEY (member_id, account_id, session) REFERENCES session(member_id, account_id, session) ON DELETE CASCADE
        )
    `);

    database.exec(`
        CREATE TABLE IF NOT EXISTS reset 
        (
            member_id       TEXT NOT NULL,
            account_id      TEXT NOT NULL,            
            source          TEXT NOT NULL,
            rarity          TEXT NOT NULL,            
            total           INTEGER NOT NULL,
            session         TEXT NOT NULL,
            timestamp       TEXT DEFAULT (STRFTIME('%Y-%m-%dT%H:%M:%SZ', 'now')),
            FOREIGN KEY (member_id, account_id) REFERENCES account(member_id, account_id) ON DELETE CASCADE ON UPDATE CASCADE,
            FOREIGN KEY (member_id, account_id, session) REFERENCES session(member_id, account_id, session) ON DELETE CASCADE
        )
    `);

    database.exec(`
        CREATE TABLE IF NOT EXISTS champion 
        (
            member_id       TEXT NOT NULL,
            account_id      TEXT NOT NULL,
            source          TEXT,
            rarity          TEXT,        
            total           INTEGER DEFAULT 0,
            champion        TEXT NOT NULL,
            session         TEXT NOT NULL,
            timestamp       TEXT DEFAULT (STRFTIME('%Y-%m-%dT%H:%M:%SZ', 'now')),
            FOREIGN KEY (member_id, account_id) REFERENCES account(member_id, account_id) ON DELETE CASCADE ON UPDATE CASCADE,
            FOREIGN KEY (member_id, account_id, session) REFERENCES session(member_id, account_id, session) ON DELETE CASCADE
        )
    `);


    database.exec(`
        CREATE INDEX IF NOT EXISTS index_session_member_account_timestamp
        ON session(member_id, account_id, timestamp DESC)
    `);
    
    
    database.exec(`
        CREATE INDEX IF NOT EXISTS index_pull_member_account_timestamp
        ON pull(member_id, account_id, timestamp DESC)
    `);
    
    database.exec(`
        CREATE INDEX IF NOT EXISTS index_pull_member_account_session
        ON pull(member_id, account_id, session)
    `);
    
    
    database.exec(`
        CREATE INDEX IF NOT EXISTS index_reset_member_account_timestamp
        ON reset(member_id, account_id, timestamp DESC)
    `);
    
    database.exec(`
        CREATE INDEX IF NOT EXISTS index_reset_member_account_session
        ON reset(member_id, account_id, session)
    `);
    
    
    database.exec(`
        CREATE INDEX IF NOT EXISTS index_champion_member_account_timestamp
        ON champion(member_id, account_id, timestamp DESC)
    `);
    
    database.exec(`
        CREATE INDEX IF NOT EXISTS index_champion_member_account_session
        ON champion(member_id, account_id, session)
    `);

}

export { Mercy }