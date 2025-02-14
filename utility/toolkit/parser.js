

class Parser
{
    static async mercy(data)
    {     
        const buffer = {};
    
        for (const { shard, rarity, count, lifetime, lastAdded, lastReset, lastPull } of data) 
        {
            buffer[shard] ??= {};
            buffer[shard][rarity] ??= {};
            
            Object.assign(buffer[shard][rarity], { count, lifetime, lastAdded, lastReset, lastPull });
        }
        Object.keys(data).forEach((key) => delete data[key]);
        Object.assign(data, buffer);
    }
        

}


export { Parser }