import fs                   from 'node:fs';
import path                 from 'node:path';
import { pathToFileURL }    from 'node:url';
import { log }              from '#utils/logger/log.js';
import { Flags }            from './flag.js';


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
        const module    = await import(fileURL);
        const object    = module.default;
        const flag      = module.flag;

        if (!object) 
        {
            log.trace(module ? `Skipping module (No autoload flag): ${fileURL}` 
                             : `File load failed (No object data found): ${fileURL}`);
            return;
        }

        
        if (object?.flag instanceof Flags) 
        {
            if (!object.flag?.autoload?.get())
            {
                log.trace(`Skipping load (Autoload flag instance set to ignore): ${fileURL}`)
                return
            }
            
        }
        else if (!flag)
        {
            log.trace(`Skipping load: ${fileURL}`)
            return
        }

        log.trace(`Loading JavaScript module: ${fileURL})`);
        await callbackFunction(object, ...args);
    }


    static async loadJSON(filePath, callbackFunction, ...args) 
    {
        const data = fs.readFileSync(filePath, 'utf8');

        if (!data) 
        {
            log.error(`File load failed (Empty or unreadable JSON): ${filePath}`);
            return;
        }

        let json;

        try 
        {
            json = JSON.parse(data);
        } catch (error) 
        {
            log.error(`File load failed (Invalid JSON format): ${filePath}`);
            return;
        }

        log.trace(`Loading JSON data: ${filePath}`);

        if (!json?.flag?.autoload) 
        {
            log.trace(`Skipping load (Autoload flag instance set to ignore): ${fileURL}`)
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