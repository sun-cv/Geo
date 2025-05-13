

class Parser
{

    static memberData(data)
    {
        return {
            ...data,
            data:       JSON.parse(data.data),
            settings:   JSON.parse(data.settings),
            records:    JSON.parse(data.records)
        }
    }

    static accountData(data, member) 
    {
        return {
            ...data,
            member:     { username: member.username, id: member.id },
            id:         data.account_id,
            data:       JSON.parse(data.data),
            settings:   JSON.parse(data.settings)
        };
    }
    
    static accountMercy(data)
    {     
        const buffer   = {};

        for (const { source, rarity, total, lifetime, session, lastAdded, lastReset, lastChampion } of data) 
        {
            buffer[source] ??= {};
            buffer[source][rarity] ??= {};
            
            Object.assign(buffer[source][rarity], { total, lifetime, session, lastAdded, lastReset, lastChampion });
        }
        return buffer;
    }

    static accountMercyTransfer(data)
    {
        const buffer = {};
    
        for (const { shard, count, totalCount, lastAdded, lastPulled, lastReset } of data)
        {
            const [source, rarityRaw] = shard.split(".");
            const rarity = rarityRaw ?? "legendary";
            const total = count;
            const lifetime = totalCount;
    
            buffer[source] ??= {};
            buffer[source][rarity] ??= {};
    
            Object.assign(buffer[source][rarity], {
                total,
                lifetime,
                session: lastPulled || null,
                lastAdded: lastAdded || null,
                lastReset: lastReset || null,
                lastChampion: null,
            });
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

    static applicationData(data = {}) {
        return { 
            ...data,
            member:     
            {
                id:                data.member_id, 
                username:          data.member,
            },
            selection:  JSON.parse(data.selection),
            clanboss:   JSON.parse(data.clanboss),
            hydra:      JSON.parse(data.hydra),
            chimera:    JSON.parse(data.chimera),
            siege:      JSON.parse(data.siege),
            cvc:        JSON.parse(data.cvc),
            data:       JSON.parse(data.data),
            setting:    JSON.parse(data.setting),
            admin:      JSON.parse(data.admin),
            meta:       JSON.parse(data.meta),
        };
    }      
}


export { Parser }