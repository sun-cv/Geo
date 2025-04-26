import parser   from 'cron-parser';


class Timestamp 
{
    static options = { timeZone: 'America/New_York' };

    static formatDate(pastStamp) 
    {
        const date = pastStamp ? new Date(pastStamp) : new Date();

        const formatter = new Intl.DateTimeFormat('en-US', 
        {
            ...this.options,
            dateStyle: 'short',
            timeStyle: 'medium'
        });

        const [formattedDate, time] = formatter.format(date).split(', ');
        const [month, day, year] = formattedDate.split('/').map(num => num.padStart(2, '0'));

        const [hour, minute, second] = time.split(':');
        const paddedHour = hour.length === 1 ? ` ${hour}` : hour;
        const formattedTime = `${paddedHour}:${minute}:${second}`;

        return { date, formattedDate, time: formattedTime, day, month, year };
    }

    static get hour() 
    {
        return (pastStamp) => this.formatDate(pastStamp).time;
    }

    static get day() 
    {
        return (pastStamp) => this.formatDate(pastStamp).day;
    }

    static get month()
    {
        return (pastStamp) => this.formatDate(pastStamp).month;
    }

    static get year()
    {
        return (pastStamp) => this.formatDate(pastStamp).year;
    }

    static get date()
    {
        return (pastStamp) => this.formatDate(pastStamp).formattedDate;
    }

    static get monthDay()
    {
        return (pastStamp) => 
        {
            const { month, day } = this.formatDate(pastStamp);
            return `${month}/${day}`;
        };
    }

    static get unix()
    {
        return (pastStamp) => (pastStamp ? new Date(pastStamp).getTime() : Date.now());
    }

    static get iso()
    {
        return (pastStamp) => (pastStamp ? new Date(pastStamp).toISOString() : new Date().toISOString());
    }

    static get reversed()
    {
        return (pastStamp) => 
        {
            const { formattedDate, time } = this.formatDate(pastStamp);
            return `${time} ${formattedDate}`;
        };
    }

    static get backup() 
    {
        return (pastStamp) => 
        {
            const date  = pastStamp ? new Date(pastStamp) : new Date();
            const year  = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day   = String(date.getDate()).padStart(2, '0');

            return `backup_${year}-${month}-${day}`            
        };
    }

    static get session()
    {
        return (pastStamp) => 
        {
            const { month, day, year} = this.formatDate(pastStamp);
            return `${month}/${day}/${year}`;
        }
    }
    static shortSession(session)
    {
        if (!session) return ' '
        return session.split('/').slice(0, 2).join('/');
    }


    static executionTime(schedule, timezone = 'America/New_York') 
    {
        const interval  = parser.parseExpression(schedule, { currentDate: new Date(), tz: timezone });
        const date      = interval.next().toDate();
    
        return date.toLocaleString('en-US', 
        {
            hour12: true,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        }) + ' ' + date.toLocaleDateString('en-US', 
        {
            month: '2-digit',
            day: '2-digit',
            year: 'numeric',
        });
    }
    
}

export { Timestamp };
