

class Trie 
{
    constructor() 
    {
        this.root = new TrieNode();
    }
    
    insert(word) 
    {
        let node = this.root;

        for (const char of word) 
        {
            if (!node.children[char]) 
            {
                node.children[char] = new TrieNode();
            }
            node = node.children[char];
        }
        node.isEndOfWord = true;
    }
    
    search(prefix) 
    {
        let node = this.root;

        for (const char of prefix) 
        {
            if (!node.children[char]) 
            {
                return [];
            }
            node = node.children[char];
        }
        return this.collectAllWords(node, prefix);
    }
    
    collectAllWords(node, prefix) 
    {
        let results = [];

        if (node.isEndOfWord) 
        {
            results.push(prefix);
        }
        for (const [char, childNode] of Object.entries(node.children)) 
        {
            results = results.concat(this.collectAllWords(childNode, prefix + char));
        }
        return results;
    }
}

class TrieNode 
{
    constructor() 
    {
        this.children = {};
        this.isEndOfWord = false;
    }
}

export { Trie }