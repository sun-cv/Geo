import { Timestamp } from "../../../../utility/index.js";

class Session
{
    constructor(account, existing)
    {
        this.account    = account;

        this.pull       = existing?.pull         || false;
        this.reset      = existing?.reset        || false;
        this.champion   = existing?.champion     || false;
        this.session    = existing?.sessiom      || Timestamp.session();
        this.timestamp  = existing?.timestamp    || Timestamp.iso();

        this.log        = new Logs();
    }

    logPull(shard, count)
    {
        this.pull       = true;
        this.log.addPull({shard, count});
    }

    logReset(shard, rarity, total)
    {
        this.reset      = true;
        this.log.addReset({shard, rarity, total});

    };

    logChampion(shard, rarity, total, champion)
    {
        this.champion   = true;
        this.log.addChampion({shard, rarity, total, champion});
    };

    refresh()
    {
        this.pull       = false;
        this.reset      = false;
        this.champion   = false;
        this.session    = Timestamp.session();
        this.timestamp  = Timestamp.iso()
    }

    lastPull()
    {
        return this.log.lastLog('pull');
    }

    lastReset()
    {
        return this.log.lastLog('reset');
    }

    lastChampion()
    {
        return this.log.lastLog('champion');
    }

}

class Logs
{
    constructor()
    {
        this.pull       = []
        this.reset      = []
        this.champion   = []
    }

    addPull(data)
    {
        this.pull.push(new Log(data, true));
    }
    
    addReset(data)
    {
        this.reset.push(new Log(data, true));
    }

    addChampion(data)
    {
        this.champion.push(new Log(data, true))
    }

    lastLog(log)
    {
        return this[log][this[log].length - 1];
    }

}

class Log
{
    constructor(data, write)
    {
        this.shard      = data?.shard       || null;
        this.rarity     = data?.rarity      || null;
        this.count      = data?.count       ?? null;
        this.total      = data?.total       ?? null
        this.champion   = data?.champion    || null;
        this.session    = data?.session     || Timestamp.session();
        this.timestamp  = data?.timestamp   || Timestamp.iso();
        this.write      = write             || false;
    }
}


export { Session }