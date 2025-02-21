import { Collection } from "discord.js";


class Session
{
    constructor(member)
    {
        this.member  = member
        this.history = [];
    }

    to(callbackFunction )
    {
        log.trace(`${this.member.user.username} is heading to ${callbackFunction}`);
        this.history.push(callbackFunction)
        return this;
    }

    with(...args)
    {
        if (this.history.length != 0)
        {
            this.history.at(-1)(...args)
        }
    }

    back()
    {
        if (this.history.length > 1)
        {
            this.buffer.push(this.history.pop());
            return this.history.at(-1)
        }
        log.debug('Navigation origin reached.')
    }

}


class Navigation
{
    constructor()
    {
        if (Navigation.instance) return Log.instance;
        Navigation.instance = this;

        this.session        = new Collection();
    }

    member(member)
    {
        if (!this.session.has(member.id))
        {
            this.session.set(member.id, new Session(member));
        }

        return this.session.get(member.id);
    }
}


const navigate = new Navigation();

export { navigate };