

class Parser
{
    static mercyAccount(data)
    {     
        const buffer   = {};

        for (const { shard, rarity, total, lifetime, lastAdded, lastReset, lastPull } of data) 
        {
            buffer[shard] ??= {};
            buffer[shard][rarity] ??= {};
            
            Object.assign(buffer[shard][rarity], { total, lifetime, lastAdded, lastReset, lastPull });
        }
        return buffer;
    }
}


export { Parser }