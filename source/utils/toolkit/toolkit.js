

class Toolkit
{

    static delay(ms, callback) {
        return new Promise(resolve => {
            setTimeout(() => {
                if (callback) callback();
                resolve();
            }, ms);
        });
    }

    static clamp(value, min, max)
    {
        return Math.max(min, Math.min(max, value));
    }
    
}

export { Toolkit }