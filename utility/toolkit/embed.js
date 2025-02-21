

class Embed
{
    constructor(embed)
    {
        this.embed = embed
    }

    static set(embed)
    {
        return new Embed(embed);
    }

    buffer(count, limit, inline = true)
    {
        for (let i = 0; i < count; i++) 
        {
	    	this.embed.addFields({ name: ' ', value: `${Text.set(' ').constrain(limit)}`, inline: inline});
	    }
        return this;
    }


}


export { Embed }