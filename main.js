import '#env/directory/loader.js';
import { Bot }  from '#bot'


const Geo = new Bot();

async function main()
{        
    await Geo.initialize();
}


main();