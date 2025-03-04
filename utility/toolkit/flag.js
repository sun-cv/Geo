import Shards               from '../../source/data/mercy/shards.json' with { type: 'json' };

class Flag 
{
    constructor(initialValue = false) 
    {
        this.value = initialValue;
    }

    set(value = true) 
    {
        this.value = value;
    }

    get() 
    {
        return this.value;
    }

    clear() 
    {
        this.value = false;
    }

    toggle() 
    {
        this.value = !this.value;
    }
}


class Flags
{
    constructor(flags = []) 
    {
        for (const flag of flags) 
        {
            this[flag] = new Flag();
        }
    }

    all() 
    {
        return Object.fromEntries(
            Object.entries(this).map(([key, flag]) => [key, flag.get()])
        );
    }
}

class FlagBuilder
{
    
    static account()
    {
        const flags      = { mercy: {} }

        flags.account    = new Flags(['dirty', 'active'])

        for (const [shard, rarities] of Object.entries(Shards.mercy))
        {
            flags.mercy[shard] = {};

            for (const rarity in rarities)
            {
                flags.mercy[shard][rarity] = new Flags(['dirty']);
            }
        }

        return flags
    }
}


export { Flag, Flags, FlagBuilder }




