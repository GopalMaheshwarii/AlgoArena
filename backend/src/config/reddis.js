let { createClient }=require('redis');

const client = createClient({
    username: 'default',
    password: process.env.REDIS_PASS,
    socket: {
        host: 'redis-12034.crce206.ap-south-1-1.ec2.redns.redis-cloud.com',
        port: 12034
    }
});


module.exports=client