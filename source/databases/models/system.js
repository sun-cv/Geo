import directory    from '#env/directory/path.json'    with { type: 'json' };
import { log }      from '#utils';
import Database     from './database.js';


class System extends Database
{
    constructor()
    {
        super(directory.databases.system.path)

        create(this.database);
    }

    // Kappa

    getKappa()
    {
        const data = this.database.prepare("SELECT member_id FROM task_kappa ORDER BY kappa DESC LIMIT 1").get()
        log.trace(`Retrieved golden kappa data entry`)
        return data;
    }

    addKappa(member)
    {
        this.database.prepare("INSERT INTO task_kappa(member_id, username) VALUES (?, ?)").run(member.id, member.user.username,)
        log.trace(`Added golden kappa data entry ${member.user.username}`)
    }

}

async function create(database)
{
    log.debug(`Establishing connection to database: System`);

    database.exec
    (`
        CREATE TABLE IF NOT EXISTS task_kappa
        (
            kappa       INTEGER     PRIMARY KEY AUTOINCREMENT,
            member_id   TEXT        NOT NULL,
            username    TEXT        NOT NULL,
            timestamp   TEXT DEFAULT (STRFTIME('%Y-%m-%dT%H:%M:%SZ', 'now'))
        )
    `)
}


export { System }