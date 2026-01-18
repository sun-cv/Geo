import fs   from 'fs';
import path from 'path';

const config    = JSON.parse(fs.readFileSync('./env/config.json', 'utf-8'));
const basePath  = path.join(config.root, config.project, config.env);
const sharePath = path.join(config.root, config.project, "shared")
const paths     = { root: basePath, shared: sharePath };

for (const [group, entries] of Object.entries(config.paths)) 
{
	const groupBase = path.join(basePath, 'source', group);
	paths[group]    = Object.fromEntries(Object.entries(entries).map(([key, file]) => [key, { path: path.join(groupBase, file), backup: {} }]));
}



for (const [group, backupDrives] of Object.entries(config.backups)) 
{
	if (!config.paths[group]) continue;

	backupDrives.forEach(drive => 
    {
		const driveRoot = config.sources[drive];

		if (driveRoot) 
        {
			const driveBase = path.join(driveRoot, config.project, config.env);
			for (const [dataName, dataObj] of Object.entries(paths[group])) 
            {
                const backupPath = path.join(driveBase, dataName);
				dataObj.backup[drive] = backupPath;
			}
		}
	});
}

fs.writeFileSync('./env/directory/path.json', JSON.stringify(paths, null, '\t').replace(/\\\\/g, '/'));
