const mongoose = require('mongoose');
const redis = require('redis');
const util = require('util');

const redisUrl = 'redis://127.0.0.1:6379';
const client = redis.createClient(redisUrl);
client.hget = util.promisify(client.hget);

// Get reference to original mongoose exec function
const exec = mongoose.Query.prototype.exec;

// Attach cache function to mongoose Query
mongoose.Query.prototype.cache = function (options = {}) {
    // set flag
    this.useCache = true;
    this.hashKey = JSON.stringify(options.key || ''); // set configurable top level key, if none supplied, use ''

    return this; // make chainable
};

// Overwrite exec function
mongoose.Query.prototype.exec = async function () {
    // Check to see if useCache has been set
    if(!this.useCache) {
        // cache not set, so return original exec function
        return exec.apply(this, arguments);
    }

    // copy properties from getQuery / mongooseCollection to new object to create redis key
    // need to do this so we don't modify the getQuery object
    const key = JSON.stringify(Object.assign({}, this.getQuery(), {
        collection: this.mongooseCollection.name
    }));

    // Check redis for key
    const cacheValue = await client.hget(this.hashKey, key);

    // If yes, return value from redis
    if(cacheValue) {
        console.log('CACHE', key);
        // App expects mongoose model to be returned, so need to convert stringified JSON to mongoose model by creating new model
        // const doc = new this.model(JSON.parse(cacheValue));

        const doc = JSON.parse(cacheValue);

        return Array.isArray(doc)
            ?  doc.map(d => new this.model(d)) // is array of objects, so map through and convert to mongoose model for each
            : new this.model(doc); // is single object returned, so convert to mongoose model
    }

    // If no, issue query, return result, store result in redis

    console.log('MONGODB', key);

    const result = await exec.apply(this, arguments); // original exec code, returns mongoose document instance (NOT JS OBJECT!)

    client.hset(this.hashKey, key, JSON.stringify(result), 'EX', 10); // need to stringify the result to store in redis, set expiry to 10 seconds

    return result;
};

module.exports = {
    clearHash(hashKey) {
        client.del(JSON.stringify(hashKey));
    }
}