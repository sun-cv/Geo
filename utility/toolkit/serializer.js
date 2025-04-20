class Serializer
{
    static clanData(data)
    {
        return {
            ...data,
            channel:        JSON.stringify(data.channel),
            leadership:     JSON.stringify(data.leadership),
            member:         JSON.stringify(data.member),
            settings:       JSON.stringify(data.settings),
            statistics:     JSON.stringify(data.statistics),
            recruitment:    JSON.stringify(data.recruitment),
        }        
    }

    static memberData(data)
    {
        return {
            ...data,
            accounts:       JSON.stringify(data.accounts),
            data:           JSON.stringify(data.data),
            settings:       JSON.stringify(data.settings),
            records:        JSON.stringify(data.records)
        }
    }

    static accountData(data)
    {
        return {
            ...data,
            data:           JSON.stringify(data.data),
            settings:       JSON.stringify(data.settings),
            records:        JSON.stringify(data.records),
        }
    }


    
}

export { Serializer }