

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

    valueOf() 
    {
        return this.value;
    }

    toJSON() 
    {
        return this.value;
    }
}



class Flags 
{
    constructor(flags = {}) 
    {
        if (Array.isArray(flags)) 
        {
            for (const key of flags) 
            {
                this[key] = new Flag(false);
            }
        } 
        else 
        {
            for (const [key, value] of Object.entries(flags)) 
            {
                this[key] = new Flag(value);
            }
        }
    }

    all() 
    {
        return Object.fromEntries
        (
            Object.entries(this).map(([key, flag]) => [key, flag.get()])
        );
    }

    load(data) 
    {
        for (const [key, value] of Object.entries(data)) 
        {
            if (this[key]) 
            {
                this[key].set(value);
            }
        }
    }

    static from(input, defaults) 
    {
        const flags = new Flags(defaults);

        if (input) 
        {
            flags.load(input);
        }
        return flags;
    }
}



export { Flag, Flags }
