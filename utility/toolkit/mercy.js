import Shards from '../../source/data/mercy/shards.json' with { type: 'json' }


class MercyUtil
{
    static forEachShard(callback, { prism = false } = {})
    {
        for (const [shard, rarities] of Object.entries(Shards.mercy)) 
        {
            if (shard === 'prism' && !prism) continue;
    
            for (const rarity of Object.keys(rarities)) 
            {
                callback(shard, rarity);
            }
        }
    }

    static *shardEntries(prism = true) 
    {
        for (const [shard, rarities] of Object.entries(Shards.mercy)) 
        {
            if (shard === 'prism' && !prism) continue;
    
            for (const rarity of Object.keys(rarities)) 
            {
                yield [shard, rarity];
            }
        }
    }
    

    static isShard(source) 
    {
        for (const [shard] of this.shardEntries()) 
        {
            if (shard === source) 
            {
                return true; 
            }
        }
        return false;
    }
    
    static calculateMercy(shard, rarity, total)
    {
        const { base, start, increase } = Shards.mercy[shard][rarity];
    
        const bonus   = Math.max(0, total - start + 1) * increase;
        const percent = Math.min(base + bonus, 100);
    
        const formatted = percent < 1 ? `.${percent.toFixed(1).split('.')[1]}` : percent.toFixed(1);
    
        return `${formatted}%`;
    }
    

}


export { MercyUtil }