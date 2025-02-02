import { Bot } from "./source/bot.js"
import { log } from "./utility/logger/log.js"

const Geo = new Bot();

async function main()
{
    log.system("Initiating startup sequence");

    await Geo.initialize();  // Ensures initialization completes

    await Geo.engage();
    
    process.on("SIGINT", shutdownHandler);
    process.on("SIGTERM", shutdownHandler);
    
}

process.on("unhandledRejection", (error) => {
    log.error("Unhandled Rejection:", error);
});

const shutdownHandler = async () => {
    log.system("Shutting down gracefully...");
    await Geo.shutdown();
    process.exit(0);
};
main();