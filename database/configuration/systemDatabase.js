

async function createSystemDatabase(database)
{
    log.debug(`Establishing connection to System database..`);

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
    log.trace(`Checked task_kappa table`);

}
