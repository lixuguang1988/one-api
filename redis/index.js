const { createClient } = require('redis');

let client;

const init = async () => {
    // 'redis://alice:foobared@awesome.redis.server:6380
    // redis[s]://[[username][:password]@][host][:port][/db-number]
    client = await createClient({url: 'redis://127.0.0.1:6379/1'})
    .on('error', err => {
        console.log('Redis Client Error', err)
        client = null;
        // setTimeout(init, 3000);
    })
}


const hSet = async (hash, field, value  ) => {
    try {
        await client.connect();
        await client.hSet(hash, field, value)
        await client.disconnect();
        return true
    } catch (error) {
      console.log(error)  
    }
}

const hGet = async (hash, field) => {
    try {
        await client.connect();
        const res = await client.hGetAll(hash)
        const value = res ? res[field] : null;
        await client.disconnect();
        return value
    } catch (error) {
        console.log(error)
    }
}

const set = async (key, value) => {
    try {
        await client.connect();
        await client.set(key, value)
        await client.disconnect();
    }catch (error) {
        console.log(error)
    }
}

// init();

module.exports = {
    client: client,
    hGet: hGet,
    hSet: hSet,
    set: set,
    init: init
}