class Tracer 
{
    constructor() 
    {
        this.start          = new Date();
        this.end            = {};
        this.responseTime   = {};
    }

    async close() 
    {
        this.end = new Date();
        const responseTimeMs = this.end - this.start;
        this.responseTime = (responseTimeMs >= 1000) ? (responseTimeMs / 1000).toFixed(2) + 's' : responseTimeMs + 'ms';
    }
}
