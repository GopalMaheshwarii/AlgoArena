let express=require("express");
let authRouter=express.Router();
let {register,login,logout,adminRegister,deleteProfile,checkcookie}=require("../controllers/userAuthent");
let userMiddleware=require("../middleware/userMiddleware");
let adminMiddleware=require("../middleware/adminMiddleware")
// registeruser 
// login 
// logout 
// adminRegister
// deleteprofile

authRouter.post("/register",register);
authRouter.post("/login",login);
authRouter.post("/logout",userMiddleware,logout);
authRouter.post("/admin/register",adminMiddleware,adminRegister);
authRouter.delete("/deleteProfile",userMiddleware,deleteProfile)
authRouter.get("/check",userMiddleware,checkcookie)

module.exports=authRouter;