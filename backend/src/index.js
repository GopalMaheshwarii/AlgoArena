require('dotenv').config()
let express=require("express");
let main=require("./config/db")
let redisClient=require("./config/reddis");
let authRouter=require('./routes/userAuth');
let problemRouter=require("./routes/problemCreator");
let submitRouter=require('./routes/submit');
const cookieParser = require('cookie-parser')
let cors = require('cors');
const aiRouter = require('./routes/aiChatting');
const videoRouter = require('./routes/videoCreator');

 let app=express();
 app.use(express.json());
app.use(cookieParser());

  //isse ho request is url se aarahi hai vo usko output dedega
var corsOptions = {
  origin: 'http://localhost:5173',
  credentials:true
}
app.use(cors(corsOptions))






app.use("/user",authRouter);
app.use("/problem",problemRouter);
app.use("/submission",submitRouter);
app.use('/ai',aiRouter);
app.use("/video",videoRouter);


const initializeConnection=async()=>{
    try{
       await Promise.all([main(),redisClient.connect()]);
       console.log("database connected us succesfully");
       
       app.listen(process.env.PORT,()=>{
         console.log(`i am listioning at port ${process.env.PORT}`);
       })
    }
    catch(err){
        console.log("error= "+err);
    }
}
initializeConnection();