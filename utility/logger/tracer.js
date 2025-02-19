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

export { Tracer }