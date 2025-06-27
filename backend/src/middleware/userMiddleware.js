const jwt = require("jsonwebtoken");
const User=require("../models/user");
const redisClient=require("../config/reddis")

let userMiddleware=async (req,res,next)=>{
  try{
     const{token}=req.cookies;
     if(!token) throw new Error("token is not present");

     const payload=jwt.verify(token,process.env.JWT_KEY);
      // if payload not present then it give error 

      const {_id}=payload;
      if(!_id) throw new Error("invalid token");

      const result=await User.findById(_id);
      if(!result) throw new Error("User doesn't exist");

      const isBlocked=await redisClient.exists(`token:${token}`);
      if(isBlocked)
        throw new Error("Invalid Token");

      req.result=result;
      next();
     
  }
  catch(err){
     res.status(401).send("error= "+err.message);
  }

}

module.exports=userMiddleware;




//fetch the token and verify that token 
//check the id and catch the user from it 
//check it is not in blocked list 