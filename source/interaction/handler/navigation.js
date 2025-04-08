import { Collection }   from "discord.js";
import { log }          from '../../../utility/index.js'


class Session
{
    constructor(member)
    {
        this.member  = member
        this.history = [];
    }

    visit(callbackFunction )
    {
        log.trace(`Navigating ${this.member.user.username} to ${callbackFunction.name}`);

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

    return(interaction)
    {
        return this.history.at(-1)(interaction);
    }

    back(interaction) 
    {
        if (this.history.length > 1) 
        {
            this.history.pop();
            return this.history.at(-1)(interaction);
        } 

        if (this.history.length === 1) 
        {
            return this.history.at(0)(interaction);
        } 

        log.debug('Navigation origin reached.');
    }

}


class Navigation
{
    constructor()
    {
        if (Navigation.instance) return Navigation.instance;
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

    async handle(interaction)
    {
        const data = interaction.data;

        if (data.flag.handled || !data.flag.navigation || (!data.flag.navigation && interaction.isChatInputCommand()))
        {
            return;
        }

        this.member(interaction.member).visit(data.execute);
    }
}


const navigate = new Navigation();

export { navigate };