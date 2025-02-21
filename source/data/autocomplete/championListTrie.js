import fs                   from 'node:fs';
import path                 from 'node:path';
import { fileURLToPath }    from 'url';
import { log }              from '../../../utility/index.js'
import { Trie }             from '../../../utility/algorithm/structure/trie.js';
import championListData     from '../../../source/data/autocomplete/championList.json' with { type: 'json' };

const championList = {
    data: championListData,
    trie: new Trie()
};

championList.data.champions.forEach(name => championList.trie.insert(name.toLowerCase()));

function updateChampionListTrieCache()
{
    const __filename    = fileURLToPath(import.meta.url);
    const __dirname     = path.dirname(__filename);
    const filePath      = path.join(__dirname, '..', '..', '..', 'data', 'autocomplete', 'championList.json');
    championList.data   = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    championList.trie = new Trie();
    championList.data.champions.forEach(name => championList.trie.insert(name.toLowerCase()));
    log.debug('Champion list Trie cache updated');
}

export { updateChampionListTrieCache, championList }
