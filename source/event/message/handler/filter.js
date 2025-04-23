import { Collection } from "discord.js"
import { log } from "../../../../utility/index.js";


class Filter
{

    constructor(registry)
    {
        this.registry   = registry;
        this.channels   = registry.channels;

        this.member     = registry.filter.member;
        this.content    = registry.filter.content;
        this.channel    = registry.filter.channel;
       
        this.scope      =
        {
            member:     'member',
            content:    'content',
            channel:    'channel',
        }

        // "trigger, condition, constraint, rule, "
    }

    async handle(message)
    {
        await this.matchMemberFilters(message);
        await this.matchContentFilters(message);
        await this.matchChannelFilters(message);

        await this.validateMatch(message)

        await this.execute(message);

    }

    async matchChannelFilters(message)
    {
        if (this.channel.has(message.channel.name))
        {
            const channelFilters = this.channel.get(message.channel.name)

            for (const [name, filter] of channelFilters.entries())
            {

                message.data.condition.channel.add(filter)
                message.data.condition.scopes.add(this.scope.channel)

                log.trace(`Matching filter(channel): ${name}`)
            }
        }
    }

    async matchMemberFilters(message)
    {
        if (this.member.has(message.author))
            {
                const memberFilters = this.member.get(message.author)
    
            for (const [name, filter] of memberFilters.entries())
            {
                message.data.condition.member.add(filter)
                message.data.condition.scopes.add(this.scope.member)

                log.trace(`Matching filter(member): ${name}`)
            }
            }
    }

    async matchContentFilters(message)
    {
        const content = message.content.toLowerCase();

        for (const [content, collection] of this.content.entries())
        {
            if (message.content.toLowerCase().includes(content))
            {
                for (const [name, filter] of this.content.get(content).entries())
                {
                    message.data.condition.content.add(filter)
                    message.data.condition.scopes.add(this.scope.content)
                    log.trace(`Matching filter(content): ${name}`)
                }
            }
        }
    }

    async validateMatch(message)
    {
        const { data: { condition, condition: { filters, scopes, channel, member, content }}} = message

        for (const scope of scopes)
        {
            for (const filter of condition[scope])
            {
                if (filter.evaluate(message))
                {
                    filters.add(filter);
                    log.trace(`Validate filter(${scope}): ${filter.meta.id}`)
                }
            }
        }
    }


    async execute(message)
    {
        const { data: { condition: { filters }}} = message

        for (const filter of filters)
        {
            try 
            {
                filter.execute(message);
                log.trace(`Executed filter: ${filter.meta.id}`)
            } 
            catch (error) 
            {
                log.error(error)
            }
        }
    }
}


class Condition
{
    constructor(options = {}, flag)
    {
        this.scopes     = options.scopes
        this.include    = options.include
        this.exclude    = options.exclude
        this.flag       = flag
    }

    check(message) 
    {
        if (!this.flag.bot.get() && message.author.bot) return false;
    
        const resolveChannels = (arr = []) => arr.map(channelEntry => 
        {
            if (!channelEntry) return null;
            if (/^\d{17,19}$/.test(channelEntry)) return channelEntry;

            const channel = message.guild.channels.cache.find(chan => chan.name.toLowerCase() === channelEntry.toLowerCase());
            return channel ? channel.id : null;
        }).filter(Boolean);
    
        const includeChannels = resolveChannels(this.include.channel);
        const excludeChannels = resolveChannels(this.exclude.channel);
    
        if (excludeChannels.includes(message.channel.id))                       return false;
        if (this.exclude.member.includes(message.author.id))                    return false;
        if (this.exclude.content.some(str => message.content.includes(str)))    return false;
    
        if (includeChannels.length && !includeChannels.includes(message.channel.id))                            return false;
        if (this.include.member.length && !this.include.member.includes(message.author.id))                     return false;
        if (this.include.content.length && !this.include.content.some(str => message.content.includes(str)))    return false;
    
        return true;
    }
    
}



export { Filter, Condition }