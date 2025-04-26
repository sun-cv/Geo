

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
    
}

export { Toolkit }