const Redis = require('ioredis')

const redis  = new Redis({
    host:process.env.REDIS_HOST,
    port:process.env.REDIS_PORT,
    password:process.env.REDIS_PASS
})

redis.on('connect',()=>{
    console.log('Redis Connected.')
})

module.exports = redis;
