
import fs   from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

import { log } from "../../../utility/index.js"

class FileManager
{
    constructor()
    {
    }

    static async load(folderPath, file, callbackFunction)
    {
        const filePath = path.join(folderPath, file);
        const stats    = fs.statSync(filePath);

        if (file.endsWith(".js"))
        {
            const data = await import(filePath);
            callbackFunction(data);
        }
        // Additional file type options can be added
    }

    static async loadRecursive(folderPath, callbackFunction, ...args)
    {
        const files = fs.readdirSync(folderPath);

        for (const file of files)
        {
            const filePath = path.join(folderPath, file);
            const stats    = fs.statSync(filePath);

            if (stats.isDirectory())
            {
                await this.loadRecursive(filePath, callbackFunction, ...args);
            }
            else if (file.endsWith(".js"))
            {
                const fileURL   = pathToFileURL(filePath).href;
                const data      = await import(fileURL);
                const object    = data.default;
                if (object)
                {
                    log.trace(`Loading ${object.meta.type} - ${file}`);
                    await callbackFunction(object, ...args);
                }
            }
            else
            {
                log.error("Recursive file loading failed (invalid type)");
            }
        }
    }
}
export { FileManager }