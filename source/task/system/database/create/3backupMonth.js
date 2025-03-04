import path                                     from 'path'
import envDirectory                             from '../../../../../configuration/environment/directory.json' with { type: "json" }
import { Timestamp, FileManager, log, Schema }  from '../../../../../utility/index.js';

async function backupMonth() 
{

    for (const directory of Object.values(envDirectory.path.backup))
    {
            
        const databaseDirectory = envDirectory.path.database;
        
        const backupDirectory   = path.join(directory, 'month')
        const backupFilePath    = path.join(backupDirectory, Timestamp.backup());


        await FileManager.createDirectory(backupDirectory);
        await FileManager.copyFile(databaseDirectory, backupFilePath)

        log.admin(`Monthly database back up to ${backupFilePath} complete.`);
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
