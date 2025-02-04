import path                 from 'node:path';
import { log, FileManager } from '../../utility/index.js'


const baseDir = path.resolve('source');

class ButtonHandler
{
    constructor(registry)
    {
        this.registry = registry
        this.initialize()
    }

    initialize()
    {
        FileManager.loadRecursive(path.join(baseDir, "component", "button"), registerComponent, registry )
    }

    

}

async function registerComponent(button, registry)
{
    if (Command.flag.ignore)
    {
        return;
    }
    registry.button.push(button)
}