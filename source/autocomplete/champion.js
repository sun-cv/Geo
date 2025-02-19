import { log }              from '../../utility/index.js';
import { Trie }             from '../../utility/algorithm/structure/trie.js';
import championList         from '../../source/data/mercy/championList.json' with { type: 'json' };

const trie = new Trie();
championList.champions.forEach(name => trie.insert(name.toLowerCase()));


function champion(interaction) 
{
    const focused = interaction.options.getFocused().toLowerCase();

    log.trace(`Searching for champions with: ${focused}`);

    const prefixMatches = trie.search(focused);

    const includedMatches = championList.champions
        .filter(name => 
            !prefixMatches.includes(name.toLowerCase()) &&
            name.toLowerCase().includes(focused)
        )
        .slice(0, 25 - prefixMatches.length);

    const combined = [...prefixMatches, ...includedMatches]
        .map(name => name.charAt(0).toUpperCase() + name.slice(1))
        .filter((name, index, self) => self.indexOf(name) === index)
        .slice(0, 25)
        .map(name => (name));

    return combined;
}

const autocomplete = 
{
    meta: 
    {
        id:             "champion",
        type:           "autocomplete",
        description:    "Mercy champion autocomplete. Returns all currently known champions for logging autocompletes.",
    },

    flag: 
    {
        handled:        false,
        ignore:         false,
        defer:          false,
        ephemeral:      false,
        access:         false,
        maintenance:    false,
        autocomplete:   true,
    },

    roleAssignment:     {},
    execute: champion
};

export default autocomplete;