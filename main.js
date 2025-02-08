import { Bot } from "./source/bot.js"

const Geo = new Bot();

async function main()
{
    await Geo.initialize();
    await Geo.engage();
    
}

main();