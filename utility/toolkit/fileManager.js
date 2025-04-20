import fs                   from 'node:fs';
import path                 from 'node:path';
import { pathToFileURL }    from 'node:url';
import { log }              from "../logger/log.js"


class FileManager
{
    
    static async loadFile(filePath, callbackFunction, ...args)
    {
        if (!fs.existsSync(filePath))
        {
            log.error(`File load failed (filepath not found: ${filePath})`);
            return;
        }

        const extension   = path.extname(filePath);
        const fileLoader  = this.fileLoaders[extension];

        if (!fileLoader)
        {
            log.error(`File load failed (unsupported extension: ${extension})`);
            return;
        }

        await fileLoader(filePath, callbackFunction, ...args)
    }

    
    static async loadDirectory(folderPath, callbackFunction, ...args)
    {
        
        const directory = fs.readdirSync(folderPath);

        for (const file of directory)
        {
            const filePath = path.join(folderPath, file);
            const stats    = fs.statSync(filePath);

            if (stats.isDirectory())
            {
                await this.loadDirectory(filePath, callbackFunction, ...args);
            }
            else
            {
                await this.loadFile(filePath, callbackFunction, ...args)
            }
        }
    }


    static async loadJS(filePath, callbackFunction, ...args)
    {        
        const fileURL   = pathToFileURL(filePath).href;
        const data      = await import(fileURL);
        const object    = data.default;


        if (!object)
        {
            return;
        }

        if (object?.flag?.ignore)
        {
            log.trace(`load flag set to ignore: ${fileURL}`)
            return;
        }

        log.trace(`Loading source: ${fileURL})`);
            
        if (!object)
        {
            log.error(`File.js load failed (object data not found: ${fileURL})`)
            return;
        }
        

        await callbackFunction(object, ...args);
    }


    static async loadJSON(filePath, callbackFunction, ...args)
    {
        const data = fs.readFileSync(filePath,'utf8');
        if (!data)
        {
            log.error(`File.JSON load failed (No data: ${filePath})`);
            return;
        }

        const json = JSON.parse(data);
        
        log.trace(`Loading .JSON (source: ${filePath})`);

        if (!json)
        {
            log.error(`File.JSON load failed (could not parse json data: ${filePath})`);
            return;
        }
        if (json?.flag?.ignore)
        {
            log.trace(`Load flag set to ignore.`);
            return;
        }

        await callbackFunction(json, ...args);
    }


    static get fileLoaders()
    {
        const path =
        {
            ".js":      FileManager.loadJS,
            ".json":    FileManager.loadJSON,
        }
        return path;
    }

    static async createDirectory(directory)
    {
        if (!fs.existsSync(directory))
        {
            log.debug(`Creating directory: ${directory}`);
            fs.mkdirSync(directory, { recursive: true})
        }
    }

    static async copyFile(source, target)
    {
        fs.copyFileSync(source, target);
    }

}
export { FileManager }