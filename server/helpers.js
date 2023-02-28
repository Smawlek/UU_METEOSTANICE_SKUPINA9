const NodeCache = require('node-cache');

const cache = new NodeCache({
    checkPeriod: 30 * 60 // 30 mins
});

class Helpers {

    async getCachedData(name) {
        if(cache.has(name)) {
            return cache.get(name);
        }

        return undefined;
    }

    async setCachedData(name, data) {
        cache.set(name, data);
    }
}

module.exports = Helpers