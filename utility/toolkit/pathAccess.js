


class PathAccess {

    static get(obj, path) 
    {
        return path.split('.').reduce((acc, key) => acc?.[key], obj);
    }

    static getAll(obj, paths) 
    {
        return paths.map(path => this.get(obj, path));
    }
    static set(obj, path, value) 
    {
        const keys      = path.split('.');
        const lastKey   = keys.pop();
        const target    = keys.reduce((acc, key) => acc[key] ??= {}, obj);
        target[lastKey] = value;
    }

    static has(obj, path) 
    {
        return this.get(obj, path) !== undefined;
    }

    static delete(obj, path) 
    {
        const keys      = path.split('.');
        const lastKey   = keys.pop();
        const target    = keys.reduce((acc, key) => acc?.[key], obj);

        if (target && lastKey in target)
        {
             delete target[lastKey];
        }
    }
}


export { PathAccess }