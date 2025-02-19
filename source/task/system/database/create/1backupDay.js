import path         from 'path'
import envDirectory from '../../../../../configuration/environment/directory.json' with { type: "json" }

import { Timestamp, FileManager, log } from '../../../../../utility/index.js';


async function backupDay() 
{

    for (const directory of Object.values(envDirectory.database))
    {
            
        const databaseDirectory = envDirectory.path.database;
        
        const backupDirectory   = path.join(directory, 'day')
        const backupFilePath    = path.join(backupDirectory, Timestamp.backup());


        await FileManager.createDirectory(backupDirectory);
        await FileManager.copyFile(databaseDirectory, backupFilePath)

        log.admin(`Daily database back up to ${backupFilePath} complete.`);
    }
}

const task = 
{
    meta: 
    {
        id:             "backupDay",
        type:           "task",
        description:    "Creates daily database backups to C and X drives.",
    },

    data:
    {
        schedule: `0 0 0 * * *`,
        argument: [],
        attempt: 3
    },

    flag:
    {
        reattempt: true,
    },

    execute: backupDay,

};


export default task