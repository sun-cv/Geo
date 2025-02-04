import { Bot } from "./source/bot.js"
import { log } from "./utility/logger/log.js"

const Geo = new Bot();

async function main()
{
    await Geo.initialize();
    await Geo.engage()
}

main();