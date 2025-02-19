import fs                   from 'node:fs';
import path                 from 'node:path';
import puppeteer            from 'puppeteer';
import { fileURLToPath }    from 'url';
import { log }              from '../../../../utility/index.js';
import { updateChampionListTrieCache } from '../../../data/autocomplete/championListTrie.js';

async function updateChampionList() 
{
    const __filename    = fileURLToPath(import.meta.url);
    const __dirname     = path.dirname(__filename);
    const filePath      = path.join(__dirname, '..', '..', '..', '..','..', 'assets', 'data', 'championList.json');
    const championList  = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    const browser       = await puppeteer.launch({ headless: 'shell' });
    const page          = await browser.newPage();
    const url           = 'https://hellhades.com/raid/tier-list/';
    
    await page.setViewport({ width: 1280, height: 1280 });
    await page.goto(url);
    await page.click('button.clear-button-tier-list');

    let championNames   = [];
    let lastBatch       = [];

    for (let i = 0; ; i += 60) 
    {
        await page.evaluate((offset) => 
        {
            const tile = document.querySelector(`.tl-pagination-tile[data-offset="${offset}"]`);
            if (tile) 
            {
                tile.click();
            }
        }, i);

        await page.waitForSelector('.champion-name a');

        const names = await page.evaluate(() => 
            Array.from(document.querySelectorAll('.champion-name a')).map(el => el.textContent.trim())
        );

        log.trace(`Page search offset ${i}: Found ${names.length} names`);

        if (JSON.stringify(names) === JSON.stringify(lastBatch)) 
        {
            log.trace('End of results - ending loop.');
            break;
        }

        lastBatch       = names;
        championNames   = championNames.concat(names);
    }

    const cleanNames = Array.from(new Set(championNames
        .map(name => name.replace(/ - .*/, '').replace(/''/g, '’').trim())
        .sort()
    ));

    const updatedNames  = Array.from(new Set([...cleanNames, ...championList.champions]));
    const newNames      = updatedNames.filter(name => !championList.champions.includes(name));

    if (newNames.length > 0) 
    {
        log.admin(`New names found: ${newNames.join(', ')}`);
    }
    else
    {
        
        log.admin(`No new names found.`)
    }



    fs.writeFileSync(filePath, JSON.stringify({
        champions: updatedNames,
        flag: { ignore: true}
    }, null, 4), 'utf8');
    
    log.admin(`Champion list updated at ${filePath}`);

    await browser.close();

    updateChampionListTrieCache();
}



const task = 
{
    meta: 
    {
        id:             "updateChampionAutocomplete",
        type:           "task",
        description:    "Searches hellhades.com to pull the lastest champion releases for mercy autocomplete.",
    },

    data:
    {
        schedule: `0 15 0 * * 3,7`,
        argument: [],
        attempt: 3
    },

    flag:
    {
        reattempt: true,
    },

    execute: updateChampionList

};


export default task