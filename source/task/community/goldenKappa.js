import { log, Schema } from '../../../utility/index.js'
import config from '../../../configuration/secret/credentials.json' with { type: 'json' }

async function goldenKappa(client, db)
{       
    const guild           = client.guilds.cache.get(config.guildID);
    const goldenKappa     = guild.roles.cache.find((role) => role.name === "Golden Kappa");
    const lastKappaData   = db.getKappa();

    let lastKappa = null;

    if (lastKappaData)
    {
        lastKappa = await guild.members.fetch(lastKappaData.member_id);
        await lastKappa.roles.remove(goldenKappa);
        
        log.debug(`No longer Kappa: ${lastKappa.user.username}`);
    }

    await guild.members.fetch();

    const eligibleMembers   = guild.members.cache.filter((member) => !member.user.bot && (!lastKappaData || member.id !== lastKappaData.member_id));
    const newKappa          = eligibleMembers.random();

    if (!newKappa)
    {
        log.error("No eligible member found for Golden Kappa.");
        return;
    }

    await newKappa.roles.add(goldenKappa);

    log.event(`The new goldenKappa: ${newKappa.user.username}`);

    db.addKappa(newKappa);
}


const data = Schema.task
({
    meta: 
    {
        id:             'Golden Kappa',
        category:       'System',
        description:    "Daily at midnight assigns a new random member the Golden Kappa role.",
    },

    data:
    {
        schedule:       ` 0 0 0 * * *`,
        argument:       ['client', 'database.system'],
        attempt:        3
    },

    execute: goldenKappa
})


export default data;