

class Flag 
{
    constructor(initialValue = false, key = null, parent = null) 
    {
        this.value                  = initialValue;
        this.key                    = key;

        if (parent) this.parent     = parent;

    }

    set(value = true) 
    {
        if (this.parent?._exclusive && value) 
        {
            this.parent._setOnly(this.key);
        } 
        else 
        {
            this.value = value;
        }
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
    constructor(flags = {}, exclusive = false) 
    {
        this._exclusive   = exclusive;
        this._parent      = this._exclusive ? this : null;

        console.log(this._parent)

        if (Array.isArray(flags)) 
        {
            for (const key of flags) 
            {
                this[key] = new Flag(false, key, this._parent);
            }
        } 
        else 
        {
            for (const [key, value] of Object.entries(flags)) 
            {
                this[key] = new Flag(value, key, this._parent);
            }

            if (exclusive) this._enforceExclusivity();
        }
    }

    all() 
    {
        return Object.fromEntries(Object.entries(this).filter(([_, flag]) => flag instanceof Flag).map(([key, flag]) => [key, flag.get()]));
    }

    load(data) 
    {
        for (const [key, value] of Object.entries(data)) 
        {
            if (this[key] instanceof Flag) 
            {
                this[key].set(value);
            }
        }

        if (this._exclusive) this._enforceExclusivity();
    }

    getActive() 
    {
        for (const [key, flag] of Object.entries(this)) 
        {
            if (flag instanceof Flag && flag.get()) return key;
        }
        return null;
    }

    _setOnly(activeKey) 
    {
        for (const [key, flag] of Object.entries(this)) 
        {
            if (flag instanceof Flag) 
            {
                flag.value = (key === activeKey);
            }
        }
    }

    _enforceExclusivity() 
    {
        let found = false;

        for (const [key, flag] of Object.entries(this)) 
        {
            if (!(flag instanceof Flag)) continue;

            if (flag.get()) 
            {
                if (found) flag.clear();
                else       found = true;
            }
        }

        if (!found) 
        {
            const firstKey = Object.keys(this).find(k => this[k] instanceof Flag);
            if (firstKey) this[firstKey].set(true);
        }
    }

    static from(input, defaults, { exclusive = false } = {}) 
    {
        const flags = new Flags(defaults, exclusive);
        if (input) flags.load(input);
        return flags;
    }

    toJSON() 
    {
        const data = Object.fromEntries
        (
            Object.entries(this).filter(([_, value]) => value instanceof Flag)
        );
        return data;
    }
}




export { Flag, Flags }
