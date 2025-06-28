const Problem = require("../models/problem");
const Submission = require("../models/submission");
const User = require("../models/user");
const { getLanguageById, submitBatch, submitToken } = require("../utils/problemUtility");



const submitCode=async(req,res)=>{
    try{
         //catch userid and problem id
        
         let problemId=req.params.id;
         let userId=req.result._id;

         //fetch code from user 
         let {language,code}=req.body;

         if(!userId || !code || !language || !problemId)
             throw new Error("some field is missing ");
         
         let problem=await Problem.findById(problemId);

         //make submission because any case we stored it in our database
         const submittedResult=await Submission.create({
             userId,
             problemId,
             code,
             language,
             status:"pending",
             testCasesTotal:problem.hiddenTestCases.length,//iske andar sare hote hai
         });

         //check the code with all hiden and visible test case
        let language_id = getLanguageById(language);
     
        let submissions = problem.hiddenTestCases.map((testcase) => {
                    return {
                    language_id: language_id,
                    source_code: code,
                    stdin: testcase.input,
                    expected_output: testcase.output
                    }
        });
        const submitResult=await submitBatch(submissions);
        const resultToken=submitResult.map((value)=>value.token);
        const testResult=await submitToken(resultToken);
        let testCasesPassed = 0;
        let runtime = 0;
        let memory = 0;
        let status = 'accepted';
        let errorMessage = null;
        
        for(const test of testResult){
           if(test.status_id==3){
           testCasesPassed++;
           runtime = runtime+parseFloat(test.time)
           memory = Math.max(memory,test.memory);
           }
           else{
                if(test.status_id==4){
                    status = 'error'
                    errorMessage = test.stderr
                }
                else{
                     status = 'wrong'
                     errorMessage = test.stderr
                }
        }

        }
        //fill all the details of code 
         submittedResult.status   = status;
        submittedResult.testCasesPassed = testCasesPassed;
        submittedResult.errorMessage = errorMessage;
        submittedResult.runtime = runtime;
        submittedResult.memory = memory;

        await submittedResult.save();

         //add its id in user problemSolved
      
        // if(!req.result.problemSolved.includes(problemId)){
        //    req.result.problemSolved.push(problemId);
        //    await req.result.save();
        // }
        
        if (status === "accepted") {
                await User.findByIdAndUpdate(userId, {
                    $addToSet: { problemSolved: problemId }
                });
        }

        const accepted = (status == 'accepted')
         res.status(201).json({
        accepted,
        totalTestCases: submittedResult.testCasesTotal,
        passedTestCases: testCasesPassed,
        runtime,
        memory
        })
    }
    catch(err){
        res.status(500).send("error= "+err.message)
    }
}

const runCode=async(req,res)=>{
    try{
          //run code is same only difference is that 
          //we not add in problem solved 
          //we not add it in submission 
          //just we provide result to user 
            const userId = req.result._id;
            const problemId = req.params.id;

            const {code,language} = req.body;

            if(!userId||!code||!problemId||!language)
                return res.status(400).send("Some field missing");

            const problem =  await Problem.findById(problemId);
            const languageId = getLanguageById(language);
            const submissions = problem.visibleTestCases.map((testcase)=>({
                source_code:code,
                language_id: languageId,
                stdin: testcase.input,
                expected_output: testcase.output
            }));


            const submitResult = await submitBatch(submissions);
            
            const resultToken = submitResult.map((value)=> value.token);

            const testResult = await submitToken(resultToken);
           
             let testCasesPassed = 0;
            let runtime = 0;
            let memory = 0;
            let status = true;
            let errorMessage = null;

            for(const test of testResult){
                if(test.status_id==3){
                testCasesPassed++;
                runtime = runtime+parseFloat(test.time)
                memory = Math.max(memory,test.memory);
                }else{
                if(test.status_id==4){
                    status = false
                    errorMessage = test.stderr
                }
                else{
                    status = false
                    errorMessage = test.stderr
                }
                }
            }

        
        
        res.status(201).json({
            success:status,
            testCases: testResult,
            runtime,
            memory
        });
    }
    catch(err){
        res.status(500).send("error= "+err.message)
    }
}
module.exports={submitCode,runCode};


// [
//   {
//     source_code: '#include <iostream>\n' +
//       'using namespace std;\n' +
//       '\n' +
//       'int main() {\n' +
//       '    int a, b;\n' +
//       '    cin >> a >> b;\n' +
//       '    cout << a + b;\n' +
//       '    return 0;\n' +
//       '}',
//     language_id: 54,
//     stdin: '10 20',
//     expected_output: '30',
//     stdout: '30',
//     status_id: 3,
//     created_at: '2025-06-12T06:18:39.469Z',
//     finished_at: '2025-06-12T06:18:39.862Z',
//     time: '0.002',
//     memory: 868,
//     stderr: null,
//     token: 'fdd1319d-1468-4cb0-90b3-4d3250706065',
//     number_of_runs: 1,
//     cpu_time_limit: '5.0',
//     cpu_extra_time: '1.0',
//     wall_time_limit: '10.0',
//     memory_limit: 256000,
//     stack_limit: 64000,
//     max_processes_and_or_threads: 128,
//     enable_per_process_and_thread_time_limit: false,
//     enable_per_process_and_thread_memory_limit: false,
//     max_file_size: 5120,
//     compile_output: null,
//     exit_code: 0,
//     exit_signal: null,
//     message: null,
//     wall_time: '0.02',
//     compiler_options: null,
//     command_line_arguments: null,
//     redirect_stderr_to_stdout: false,
//     callback_url: null,
//     additional_files: null,
//     enable_network: false,
//     status: { id: 3, description: 'Accepted' },
//     language: { id: 54, name: 'C++ (GCC 9.2.0)' }
//   }
// ]
 