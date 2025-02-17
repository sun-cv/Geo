import { SlashCommandBuilder, CommandInteraction }  from 'discord.js'
import { championListAutocomplete }                 from '../../autocomplete/data/championAutocomplete.js' 
import { fileURLToPath }    from 'url';
import  fs                  from 'node:fs'
import path                 from 'node:path'
import puppeteer            from 'puppeteer'
import { log }              from '../../../utility/index.js'

async function updateChampionAutocomplete() 
{
    puppeteer

	const browser   = await puppeteer.launch({ headless: 'shell' });
	const page      = await browser.newPage();
	const url       = 'https://hellhades.com/raid/tier-list/';
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    
    const filePath = path.join(__dirname, '..', '..', 'autocomplete', 'data', 'championAutoComplete.js');

	await page.setViewport({ width: 1280, height: 1280 });
	await page.goto(url);
	await page.click('button.clear-button-tier-list');

	let championNames = [];

    let lastBatch = [];

    for (let i = 0; ; i += 60) {
        await page.evaluate((offset) => {
            const tile = document.querySelector(`.tl-pagination-tile[data-offset="${offset}"]`);
            if (tile) {
                tile.click();
            }
        }, i);
    
        await page.waitForSelector('.champion-name a');
        
        const names = await page.evaluate(() => {
            return Array.from(document.querySelectorAll('.champion-name a')).map(el => el.textContent.trim());
        });
    
        console.log(`Offset ${i}: Found ${names.length} names`);
    
        if (JSON.stringify(names) === JSON.stringify(lastBatch)) {
            console.log('No new names found, ending loop.');
            break;
        }
        
        lastBatch = names;
        championNames = championNames.concat(names);
    }
    
    

	const cleanNames = Array.from(new Set(championNames
		.map(name => name.replace(/ - .*/, '').replace(/''/g, '’').trim())
		.sort()
	));

	const updatedNames = Array.from(new Set([...cleanNames, ...championListAutocomplete]));
    console.log(`Total unique names to write: ${updatedNames.length}`);

	const fileContent = 
	`const championListAutocomplete = 
    [
	${updatedNames.map(name => `'${name}'`).join(',\n\t')},
    ];
    
    export { championListAutocomplete };`;

	fs.writeFileSync(filePath, fileContent, 'utf8');
	log.admin(`Champion list updated at ${filePath}`);
    console.log(`Names to be written:\n${updatedNames.join(', ')}`);


	await interaction.editReply(`Champion List has been updated.`);
	await browser.close();
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

    execute: updateChampionAutocomplete

};


export default task