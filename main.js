import { Bot } from "./source/bot.js"
import { log } from "./utility/log/log.js"

const Geo = new Bot();

async function main()
{
    log.system("Initiating startup sequence")
    {
        await Geo.initialize()
        await Geo.engage();
        await Geo.shutdown();
    }
    log.system("Successfully shut down!")
}

main()