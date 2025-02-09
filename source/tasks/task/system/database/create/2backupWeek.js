import path from 'path'
import envDirectory from '../../../../../../environment/directory.json' with { type: "json" }

import { Timestamp, FileManager } from '../../../../../../utility/index.js';


async function backupWeek() 
{

    for (const directory of Object.values(envDirectory.path.backup))
    {
            
        const databaseDirectory = envDirectory.path.database;
        
        const backupDirectory   = path.join(directory, 'week')
        const backupFilePath    = path.join(backupDirectory, Timestamp.backup());


        await FileManager.createDirectory(backupDirectory);
        await FileManager.copyFile(databaseDirectory, backupFilePath)

        log.admin(`Weekly database back up to ${backupFilePath} complete.`);
    }
}

const task = 
{
    meta: 
    {
        id:             "backupWeek",
        type:           "task",
        description:    "Creates weekly database backups to C and X drives.",
    },

    data:
    {
        schedule: `0 0 0 * * 0`,
        argument: [],
        attempt: 3
    },

    flag:
    {
        reattempt: true,
    },

    execute: backupWeek,

};


export default task