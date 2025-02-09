import path from 'path'
import envDirectory from '../../../../../../environment/directory.json' with { type: "json" }

import { Timestamp, FileManager } from '../../../../../../utility/index.js';


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

const task = 
{
    meta: 
    {
        id:             "backupMonth",
        type:           "task",
        description:    "Creates monthly database backups to C and X drives.",
    },

    data:
    {
        schedule: `0 0 0 1 * *`,
        argument: [],
        attempt: 3
    },

    flag:
    {
        reattempt: true,
    },

    execute: backupMonth,

};


export default task