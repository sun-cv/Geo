


class Parser
{
    static accountData(data) 
    {
        return {
            ...data,
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

    static applicationData(data) {
        return data.map((application) => 
        ({ 
            ...application,
            selection:  JSON.parse(application.selection),
            clanboss:   JSON.parse(application.clanboss),
            hydra:      JSON.parse(application.hydra),
            chimera:    JSON.parse(application.chimera),
            siege:      JSON.parse(application.siege),
            cvc:        JSON.parse(application.cvc),
            data:       JSON.parse(application.data),
            setting:    JSON.parse(application.setting),
            admin:      JSON.parse(application.admin),
            meta:       JSON.parse(application.meta),
        }));
    }
    
    
}


export { Parser }