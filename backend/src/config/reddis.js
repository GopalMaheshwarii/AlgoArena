let { createClient }=require('redis');


const client = createClient({
    username: 'default',
    password: process.env.REDIS_PASS,
    socket: {
        host: 'redis-11234.c305.ap-south-1-1.ec2.redns.redis-cloud.com',
        port: 11234
    }
});

module.exports=client