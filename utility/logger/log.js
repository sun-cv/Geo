import { logEnum, logString }   from "./definitions.js"

class Log 
{
    constructor()
    {
        Log.instance = this;
        if (Log.instance)
        {
            return Log.instance;
        }

        this.events  = new Map();
    }

    static LogLevel = "Event";

    setLevel(level)
    {
        this.LogLevel = level
    }

    log(logLevel, ...args )
    {
        if (logEnum[logLevel] < logEnum[this.LogLevel])
        {
            return;
        }
        console.log(logString[logLevel], ...args);
    }

    
    trace(...args)
    {
        this.log("Trace", ...args);
    }
    debug(...args)
    {
        this.log("Debug", ...args);
    }   
    event(...args)
    {
        this.log("Event", ...args);
    }   
    error(...args)
    {
        this.log("Error", ...args);
    }   
    fatal(...args)
    {
        this.log("Fatal", ...args);
    }
    system(...args)
    {
        this.log("System", ...args);
    }    
}

const log = new Log();

export { log };

