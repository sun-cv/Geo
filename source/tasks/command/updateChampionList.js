import fs                               from 'node:fs';
import path                             from 'node:path';
import puppeteer                        from 'puppeteer';
import directory                        from '#env/directory/path.json' with { type: 'json'}
import { log, Schema }                  from '#utils';
import { updateChampionListTrieCache }  from '#utils/algorithm/championListTrie.js';

async function updateChampionList() 
{

    const filePath      = path.join(directory.root, 'source', 'resources', 'data', 'championList.json');
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
            Array.from(document.querySelectorAll('.champion-name a')).map(element => element.textContent.trim())
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
        flag: { load:           false,
}
    }, null, 4), 'utf8');
    
    log.admin(`Champion list updated at ${filePath}`);

    await browser.close();

    updateChampionListTrieCache();
}


const data = Schema.task
({
    meta: 
    {
        id:             'Update Champion list',
        category:       'mercy',
        description:    "Searches hellhades.com to pull the lastest champion releases for mercy autocomplete.",
    },

    data:
    {
        schedule:       `0 15 0 * * 3,7`,
        attempt:        3
    },
    execute: updateChampionList,
});



export default data;