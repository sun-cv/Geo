import path                                     from 'path'
import envDirectory                             from '#env/directory/path.json' with { type: 'json' };
import { Timestamp, FileManager, log, Schema }  from '#utils';

async function backupMonth() 
{
    for (const database of Object.values(envDirectory.databases))
    {
        for (const directory of Object.values(database.backup))
            {
            const databaseDirectory = database.path;
            
            const backupDirectory   = path.join(directory, 'month')
            const backupFilePath    = path.join(backupDirectory, Timestamp.backup());

            await FileManager.createDirectory(backupDirectory);
            await FileManager.copyFile(databaseDirectory, backupFilePath)

            log.admin(`monthly database back up to ${backupFilePath} complete.`);
        }
    }
}
const data = Schema.task
({
    meta: 
    {
        id:             'GFS create backup - month',
        category:       'database',
        description:    "Creates monthly database backups to C and X drives.",
    },

    data:
    {
        schedule:       `0 0 0 1 * *`,
        attempt:        3
    },

    flag:
    {
        reattempt:      true,
    },

    execute: backupMonth,
})



export default data;
