class Timestamp {
    static options = { timeZone: 'America/New_York' }; // Default to 12-hour format

    static formatDate(pastStamp) {
        const date = pastStamp ? new Date(pastStamp) : new Date();
        const formatter = new Intl.DateTimeFormat('en-US', {
            ...this.options,
            dateStyle: 'short',
            timeStyle: 'medium' // Keeps AM/PM format
        });
        const [formattedDate, time] = formatter.format(date).split(', ');
        const [month, day, year] = formattedDate.split('/');

        // Padding the hour with a space if it's a single digit
        const [hour, minute, second] = time.split(':');
        const paddedHour = hour.length == 1 ? ` ${hour}` : hour;
        const formattedTime = `${paddedHour}:${minute}:${second}`;

        return { date, formattedDate, time: formattedTime, day, month, year };
    }

    static get hour() {
        return (pastStamp) => this.formatDate(pastStamp).time;
    }

    static get day() {
        return (pastStamp) => this.formatDate(pastStamp).day;
    }

    static get month() {
        return (pastStamp) => this.formatDate(pastStamp).month;
    }

    static get year() {
        return (pastStamp) => this.formatDate(pastStamp).year;
    }

    static get date() {
        return (pastStamp) => this.formatDate(pastStamp).formattedDate;
    }

    static get monthDay() {
        return (pastStamp) => {
            const { day, month } = this.formatDate(pastStamp);
            return `${day}/${month}`;
        };
    }

    static get unix() {
        return (pastStamp) => (pastStamp ? new Date(pastStamp).getTime() : Date.now());
    }

    static get iso() {
        return (pastStamp) => (pastStamp ? new Date(pastStamp).toISOString() : new Date().toISOString());
    }

    static get reversed() {
        return (pastStamp) => {
            const { formattedDate, time } = this.formatDate(pastStamp);
            return `${time} ${formattedDate}`;
        };
    }
}

export { Timestamp };
