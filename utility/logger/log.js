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

    setlogLevel(level)
    {
        this.LogLevel = level
    }

    log(logLevel, message)
    {
        if (logEnum[logLevel] < logEnum[this.LogLevel])
        {
            return;
        }
        console.log(logString[logLevel], message);
    }

    
    trace(message)
    {
        this.log("Trace", message);
    }
    debug(message)
    {
        this.log("Debug", message);
    }   
    event(message)
    {
        this.log("Event", message);
    }   
    error(message)
    {
        this.log("Error", message);
    }   
    fatal(message)
    {
        this.log("Fatal", message);
    }
    system(message)
    {
        this.log("System", message);
    }    
}

const log = new Log();

export { log };

