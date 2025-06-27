let validate=require("../utils/validator")
const bcrypt = require('bcrypt');
let User=require("../models/user")
var jwt = require('jsonwebtoken');
let redisClient=require("../config/reddis")



let register=async(req,res)=>{
     try{
         //validate the details
         validate(req.body);
         let data=req.body;
         //bycrpt the password
         data.password= await bcrypt.hash(data.password,10);
         data.role="user";
         //add  user in user collection 
         let user=await User.create(data);

         let payload={
            _id:user._id,
            emailId:user.emailId,
            role:user.role
        }
        let token = await jwt.sign(payload,process.env.JWT_KEY,{expiresIn:60*60});
        //send the token through cookies of the user 
         res.cookie("token",token,{maxAge:60*60*1000});
         

          let reply={
             firstName:user.firstName,
             emailId:user.emailId,
             _id:user._id
         }

         res.status(200).json({
            user:reply,
            msg:"user Registered successfully"
         });
         
     }
     catch(err){
         res.status(400).send("Error: "+err);
     }
}

let login=async(req,res)=>{
    try{
        //for login we want emailId and password 
        let {emailId,password}=req.body;
        //find the user in the user collection through his emailid
        if(!emailId || !password)
            throw new Error("some field is missing");
        
        const user=await User.findOne({emailId});
        //if user not found then it through error which catched
        //but check its password too before giving him a token
        let match=await bcrypt.compare(password,user.password);
        if(!match)
            throw new Error("your password is wrong for this emailId")

        //make token for it so that  it do need to login again and again
        let payload={
            _id:user._id,
            emailId:user.emailId,
            role:user.role
        }
        let token = await jwt.sign(payload,process.env.JWT_KEY,{expiresIn:60*60});
       

        //send the token through cookies of the user 
         res.cookie("token",token,{maxAge:60*60*24*1000});//60 minute 1000 due to it in ms
         
         let reply={
             firstName:user.firstName,
             emailId:user.emailId,
             _id:user._id
         }

         res.status(200).json({
            user:reply,
            msg:"log in successfully"
         });
    }
    catch(err){
        res.status(401).send("Error "+err)
    }
    
}

let logout=async (req,res)=>{
    try{
        //run middleware for checking the token of it 
        //and find the user and which is store it in req.result 
        let {token}=req.cookies;
        //decode the token here for getting its id throgh payload 
        let data=req.result;
        let payload=jwt.decode(token);
        //send this token to to redisclient for blocked it 
        await redisClient.set(`token:${token}`,"Blocked");
        await redisClient.expireAt(`token:${token}`,payload.exp)
        // then clear the cookie of user too 
        res.cookie("token",null,{expires:new Date(Date.now())});
        res.send("logged out successfully");

    }
    catch(err){
        res.status(401).send("Error "+err)
    }
}
//for register new admin
//ist login as admin then register the user/admin
let adminRegister=async(req,res)=>{
    try{
       //first  adminmiddleware to check 
       //validate the information of req.body for making him admin
       //now repeat same steps as in register 
       validate(req.body);
         let data=req.body;
         //bycrpt the password
         data.password= await bcrypt.hash(data.password,10);
        //  data.role="admin";
        //this step is not neccesary there because it can register both admin and user
         //add  user in user collection 
         await User.create(data);
         res.status(201).send(data.role+" Registered successfully");
    }
    catch(err){
        res.status(401).send("Error "+err)
    }
}

let deleteProfile=async(req,res)=>{
    try{
        //middleware check 
        //what i delete his  profile
        //delete him from mongodb server
        //invalidate his cookie and redis is not needed if its data from
        //mongodb deleted then it never login;
        let data=req.result;
        await User.findByIdAndDelete(data._id);

        res.status(200).send("deleted succesfully");
    }
    catch(err){
        res.status(500).send("Error "+err)
    }
}
let checkcookie=async(req,res)=>{
    let user=req.result;
     let reply={
             firstName:user.firstName,
             emailId:user.emailId,
             _id:user._id,
             role:user.role
         }

     res.status(200).json({
            user:reply,
            msg:"log in successfully"
    });
    //if token is not present then it handle automatically 
    
}

module.exports={register,login,logout,adminRegister,deleteProfile,checkcookie};