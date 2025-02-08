const logEnum =
{
    Trace: 0,
    Debug: 1,
    Event: 2,
    Error: 3,
    Fatal: 4,
    Admin: 5
}

const logString =
{
    Trace: "[Trace]",
    Debug: "[Debug]",
    Event: "[Event]",
    Error: "[Error]",
    Fatal: "[Fatal]",
    Admin: "[Admin]"
}


class Tracer 
{
    constructor() 
    {
        this.start          = new Date();
        this.endTime        = {};
        this.responseTime   = {};
    }

    async close() 
    {
        this.endTime = new Date();
        const responseTimeMs = this.endTime - this.start;
        this.responseTime = (responseTimeMs >= 1000) ? (responseTimeMs / 1000).toFixed(2) + 's' : responseTimeMs + 'ms';
    }
}

export { logEnum, logString, Tracer };