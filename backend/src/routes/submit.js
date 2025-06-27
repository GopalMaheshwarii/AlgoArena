let express=require("express");
const userMiddleware = require("../middleware/userMiddleware");
let submitRouter=express.Router();
let {submitCode,runCode}=require("../controllers/userSubmission")


submitRouter.post("/submit/:id",userMiddleware,submitCode);
submitRouter.post("/run/:id",userMiddleware,runCode)

module.exports=submitRouter;