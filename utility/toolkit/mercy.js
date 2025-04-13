import Shards from '../../source/data/mercy/shards.json' with { type: 'json' }


class MercyUtil
{
    static forEachShard(callback)
    {
        for (const [shard, rarities] of Object.entries(Shards.mercy)) 
        {
            for (const rarity of Object.keys(rarities)) 
            {
                callback(shard, rarity);
            }
        }
    }

    static *shardEntries() 
    {
        for (const [shard, rarities] of Object.entries(Shards.mercy)) 
        {
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
    

}


export { MercyUtil }