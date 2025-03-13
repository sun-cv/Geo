

class Parser
{

    static accountData(inputData) 
    {
        return {
            ...inputData,
            data:       JSON.parse(inputData.data),
            settings:   JSON.parse(inputData.settings)
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

    static clanData(data)
    {
        const recruitment = JSON.parse(data.recruitment);
        recruitment.clanTag = !!recruitment.clanTag

        return {
            ...data,
            channel:        JSON.parse(data.channel),
            leadership:     JSON.parse(data.leadership),
            member:         JSON.parse(data.member),
            settings:       JSON.parse(data.settings),
            statistics:     JSON.parse(data.statistics),
            recruitment,
        }        
    }

}


export { Parser }