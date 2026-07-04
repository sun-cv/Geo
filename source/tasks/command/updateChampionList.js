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

    await page.waitForSelector('.tl-pagination-tile');

    const offsets = await page.evaluate(() =>
        Array.from(document.querySelectorAll('.tl-pagination-tile'))
            .map(tile => tile.getAttribute('data-offset'))
    );

    await page.waitForFunction(() => document.querySelectorAll('.champion-name a').length > 0);

    let championNames   = [];
    let previousFirst   = null;

    for (const offset of offsets)
    {
        await page.evaluate((offset) =>
        {
            const tile = document.querySelector(`.tl-pagination-tile[data-offset="${offset}"]`);
            if (tile)
            {
                tile.click();
            }
        }, offset);

        await page.waitForFunction((previousFirst) =>
        {
            const names = document.querySelectorAll('.champion-name a');
            return names.length > 0 && names[0].textContent.trim() !== previousFirst;
        }, {}, previousFirst);

        const names = await page.evaluate(() =>
            Array.from(document.querySelectorAll('.champion-name a')).map(element => element.textContent.trim())
        );

        previousFirst   = names[0];

        log.trace(`Page search offset ${offset}: Found ${names.length} names`);

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


updateChampionList();

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
