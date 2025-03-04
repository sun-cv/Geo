

class Parser
{

    static accountData(inputData) 
    {
        return {
            ...inputData,
            data: JSON.parse(inputData.data),
            settings: JSON.parse(inputData.settings)
        };
    }
    
    static accountMercy(data)
    {     
        const buffer   = {};

        for (const { shard, rarity, total, lifetime, lastAdded, lastReset, lastChampion } of data) 
        {
            buffer[shard] ??= {};
            buffer[shard][rarity] ??= {};
            
            Object.assign(buffer[shard][rarity], { total, lifetime, lastAdded, lastReset, lastChampion });
        }
        return buffer;
    }
}


export { Parser }