import fs               from 'fs/promises';
import path             from 'path'
import envDirectory     from '../../../../../configuration/environment/directory.json' with { type: "json" }
import { log, Schema }  from '../../../../../utility/index.js';

const RETENTION = 28;
const DAY       = 1000 * 60 * 60 * 24;

async function deleteWeek() 
{
    const now = Date.now();

    for (const backupPath of Object.values(envDirectory.path.backup)) 
    {
        const files = await fs.readdir(backupPath);

        for (const file of files) 
        {
            const dateMatch = file.match(/\d{4}-\d{2}-\d{2}/);
            if (!dateMatch) continue;

            const backupDate = new Date(dateMatch[0]).getTime();
            const fileAgeDays = (now - backupDate) / DAY;
            
            if (fileAgeDays < RETENTION) continue;

            const filePath = path.join(backupPath, file);
            await fs.unlink(filePath);

            log.admin(`Deleted backup: ${filePath}`);
        }
    }
}


const data = Schema.task
({
    meta: 
    {
        id:             'GFS delete backup - week',
        category:       'database',
        description:    "Deletes weekly database backups from C and X drives.",
    },

    data:
    {
        schedule:       `0 10 0 * * 0`,
        attempt:        3
    },
    
    execute: deleteWeek,
});



export default data;
