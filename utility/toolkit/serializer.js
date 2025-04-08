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


    
}

export { Serializer }