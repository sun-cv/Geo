import { Bot } from "./source/bot.js"

const Geo = new Bot();

process.on("exit", (code) => {
	console.log(`Process is exiting with code: ${code}`);
});

async function main()
{
    await Geo.initialize();
    await Geo.engage();
    
}

main();