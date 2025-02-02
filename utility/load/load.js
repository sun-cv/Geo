
import fs   from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';


import { log } from "../index.js";



class Load
{
    constructor()
    {

    }

    deploy(type, folderPath = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "..", "source", "command"))
    {
    }


}

export { Load }