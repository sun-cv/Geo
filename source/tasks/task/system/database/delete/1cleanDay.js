import path from 'path';
import fs from 'fs/promises';
import envDirectory from '../../../../../../environment/directory.json' with { type: "json" };
import { log } from '../../../../../../utility/index.js';

const RETENTION = 7;
const DAY = 1000 * 60 * 60 * 24;

async function cleanDay() 
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

const task = 
{
    meta: 
    {
        id:             "cleanDay",
        type:           "task",
        description:    "Deletes daily backups in C and X drives after 7 days.",
    },

    data:
    {
        schedule: `0 10 0 * * *`,
        argument: [],
        attempt: 3
    },

    flag:
    {
        reattempt: true,
    },

    execute: cleanDay,

};


export default task