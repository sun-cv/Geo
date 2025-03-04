import path                                     from 'path'
import envDirectory                             from '../../../../../configuration/environment/directory.json' with { type: "json" }

import { Timestamp, FileManager, log, Schema }  from '../../../../../utility/index.js';


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

const data = Schema.task
({
    meta: 
    {
        id:             'GFS create backup - week',
        category:       'database',
        description:    "Creates weekly database backups to C and X drives.",
    },

    data:
    {
        schedule:       `0 0 0 * * 0`,
        attempt:        3
    },
    
    execute: backupWeek,
})



export default data
