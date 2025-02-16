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

    addPull(shard, count)
    {
        this.pull       = true;
        this.log.addPull({shard, count});
    }

    addReset(shard, count, total)
    {
        this.reset      = true;
        this.log.addReset({shard, count, total});

    };

    addChampion(shard, count, total, champion)
    {
        this.champion   = true;
        this.log.addChampion({shard, count, total, champion});
    };

    refresh()
    {
        this.pull       = false;
        this.reset      = false;
        this.champion   = false;
        this.session    = Timestamp.session();
        this.timestamp  = Timestamp.iso()
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

}

class Log
{
    constructor(data, write)
    {
        this.shard      = data?.shard       || null;
        this.count      = data?.count       || null;
        this.total      = data?.total       || null
        this.champion   = data?.champion    || null;
        this.session    = data?.session     || Timestamp.session();
        this.timestamp  = data?.timestamp   || Timestamp.iso();
        this.write      = write             || false;
    }
}


export { Session }