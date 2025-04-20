import { Flag, Timestamp, log } from "../../../../utility/index.js";


class Session
{
    constructor(account, session)
    {

        this.pull       = new Flag(session?.pull)
        this.reset      = new Flag(session?.reset)
        this.champion   = new Flag(session?.champion)
        
        this.session    = session?.session      || Timestamp.session();
        this.timestamp  = session?.timestamp    || Timestamp.iso();

        this.log        = new Logs();
    }

    valid()
    {
        if (this.session == Timestamp.session())
        {
            return true;
        }

        log.debug(`Invalid session: ${this.session.session}. Refreshing session`);
        return false;
    }    
        

    logPull(shard, count)
    {
        this.pull.set()
        this.log.addPull({source: shard, count});
    }

    logReset(shard, rarity, champion, total)
    {
        this.reset.set()
        this.log.addReset({source: shard, rarity, total});
    };

    logChampion(shard, rarity, champion, total)
    {
        this.champion.set()
        this.log.addChampion({source: shard, rarity, champion, total});
    };

    refresh()
    {
        this.pull       .clear()
        this.reset      .clear()
        this.champion   .clear()
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
        this.source     = data?.source      || null;
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