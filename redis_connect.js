const redis = require('redis');
const redis_client = redis.createClient()
redis_client.connect()
redis_client.on('connect', function(){
    console.log('redis client connected');
})

module.exports = redis_client