let {getLanguageById,submitBatch,submitToken}=require("../utils/problemUtility")
let Problem=require("../models/problem");
const User = require("../models/user");
const Submission = require("../models/submission");
const SolutionVideo = require("../models/solutionVideo");


let createProblem=async(req,res)=>{
    try{
         //fetch the data from req.body
         let ques=req.body;
         //use loop to get make array of all submission 
         let submissions=[];

         //{
            //language_id: 1,
           //source_code: '',
           //stdin
          //stdout
        // }

        for (let { language, completeCode } of ques.referenceSolution) {
                let language_id = getLanguageById(language);

                let arr1 = ques?.visibleTestCases.map((testcase) => {
                    return {
                    language_id: language_id,
                    source_code: completeCode,
                    stdin: testcase.input,
                    expected_output: testcase.output
                    }
                });

                let arr2 = ques?.hiddenTestCases.map((testcase) => {
                    return {
                    language_id: language_id,
                    source_code: completeCode,
                    stdin: testcase.input,
                    expected_output: testcase.output
                    }
                });

                submissions.push(...arr1, ...arr2);
        }
         //then pass it to submitbatch
         
         const submitResult=await submitBatch(submissions);
         //it give token make array of it and pass through submittoken
         const resultToken=submitResult.map((value)=>value.token);
         const testResult=await submitToken(resultToken);
         //get result of token check all status_id==3;
         const isAllowed=testResult.every((value)=>value.status_id==3);

         if(!isAllowed)
            throw new Error("this problem not pass all the test cases you provided")

         //now add that problem in problem collection with userid
         await Problem.create({
            ...ques,
            problemCreater:req.result._id
         });
         res.status(201).send("problem saved succesfully");
    }
    catch(err){
        console.log("error")
        res.status(500).send("Error "+err.message);
    }
}
let updateProblem=async(req,res)=>{
    
    try{
           //param se problem fetch karo 
           
           let {id}=req.params;
           const ques=req.body;
           if(!id) throw new Error("missing id field");
           //now check it is right or not 
           let submissions=[];
           
        for (let { language, completeCode } of ques.referenceSolution) {
                let language_id = getLanguageById(language);

                let arr1 = (ques?.visibleTestCases||[]).map((testcase) => {
                    return {
                    language_id: language_id,
                    source_code: completeCode,
                    stdin: testcase.input,
                    expected_output: testcase.output
                    }
                });
               
                let arr2 = (ques.hiddenTestCases || []).map((testcase) => {
                    return {
                    language_id: language_id,
                    source_code: completeCode,
                    stdin: testcase.input,
                    expected_output: testcase.output
                    }
                });
                console.log("hello");
                submissions.push(...arr1, ...arr2);
        }
        
         const submitResult=await submitBatch(submissions);
         const resultToken=submitResult.map((value)=>value.token);
         const testResult=await submitToken(resultToken);
         const isAllowed=testResult.every((value)=>value.status_id===3);
         if(!isAllowed)
            throw new Error("this problem not pass all the test cases you provided")

        //now update it throw findbyIdandUpdate
        const update=await Problem.findByIdAndUpdate(id,{...req.body},{runValidators:true,new:true})
         res.status(200).send("problem updated succesfully ");
    }
    catch(err){
        res.status(500).send("Error "+err.message);
    }
}
let deleteProblem=async(req,res)=>{
    try{
            //problem id se problem find karo
            let {id}=req.params;
            
                if(!id) throw new Error("id is missing");
                const deletedProblem=await Problem.findByIdAndDelete(id)
                if(!deletedProblem) 
                    throw new Error("problem is missing")
                const deleteSubmission=await Submission.deleteMany({problemId:id});
                if(!deleteSubmission)
                    throw new Error("submission not delete ");

                await User.updateMany(
                    {},
                    { $pull: { problemSolved: id } }
                    );
                return res.status(200).send("problem deleted succesfully")

                
            
            //delete kardo 
    }
    catch(err){
        res.status(500).send("Error "+err.message);
    }
}


let getProblemById=async(req,res)=>{
    try{
          //take id from params
          //find the problem and send to you
          const {id} = req.params;
          if(!id)
          return res.status(400).send("ID is Missing");
         //here we do not want to show hiddentestcases and problemcreator 
          const getProblem = await Problem.findById(id).select('_id title description difficulty tags visibleTestCases startCode referenceSolution ');
          
          if(!getProblem)
           res.status(404).send("Problem is Missing");
          
          const videos =await SolutionVideo.findOne({problemId:id});

          if(videos){
            let responseData={
                ...getProblem.toObject(),
                secureUrl:videos.secureUrl,
                thumbnailUrl : videos.thumbnailUrl,
               duration : videos.duration,
            }
           res.status(200).send(responseData);
          }
          
          res.status(200).send(getProblem);
  
    }
    catch(err){
        res.status(500).send("Error "+err.message);
    }
}
let getAllProblem=async(req,res)=>{
    try{
         let getProblem=await Problem.find({}).select("-hiddenTestCases -problemCreater -createdAt -updatedAt -__v")
         if(getProblem.length==0)
              return res.status(404).send("Problem is Missing");
        res.status(200).send(getProblem);
    }
    catch(err){
        res.status(500).send("Error "+err.message);
    }
}
let solvedAllProblembyUser=async(req,res)=>{
    try{
          //solved poblem ids present in the form of array in user.problemSolved
          //so take it from there
          let userid=req.result._id;
          //fetch user
          let user=await User.findById(userid);
           
          let solvedProblem=await Promise.all(user.problemSolved.map(async(id)=>await Problem.findById(id)))
        //   const user =  await User.findById(userId).populate({
        //                 path:"problemSolved",
        //                 select:"_id title difficulty tags"
        //    });
       
          res.send(solvedProblem);
    }
    catch(err){
        res.status(500).send("Error "+err.message);
    }
}
let submittedProblem=async(req,res)=>{
    try{
        //uski userId and ProblemId se fetch kar do 
        // then it return its all submissions 
        const userId=req.result._id;
        const problemId=req.params.pid;
        const ans=await Submission.find({userId,problemId});
        if(ans.length==0)
            res.status(200).send("No submission for that problem ")
        res.status(200).send(ans);
    }
    catch(err){
        res.status(500).send("Error "+err.message);
    }
}


module.exports = {createProblem,updateProblem,deleteProblem,getProblemById,getAllProblem,solvedAllProblembyUser,submittedProblem };


//685c0f1eb67e00de5316386a