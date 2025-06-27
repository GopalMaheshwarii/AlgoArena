const axios = require('axios');

const getLanguageById=(lang)=>{
      const language={
        "c++":54,
        "java":62,
        "javascript":63
      }
      return language[lang.toLowerCase()];
}


const submitBatch=async(submissions)=>{
const options = {
  method: 'POST',
  url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
  params: {
    base64_encoded: 'false'
  },
  headers: {
    'x-rapidapi-key': '245786d1b6msh2028680b7243a0dp19ba3djsn9bba74664eea',
    'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
    'Content-Type': 'application/json'
  },
  data: {
    submissions
  }
};

async function fetchData() {
	try {
		const response = await axios.request(options);
		return response.data;
	} catch (error) {
		console.error(error);
     throw new Error("Failed to submit batch to Judge0"); // ✅ Rethrow
	}
}

return await fetchData();
        
}

const waiting=(timeout)=>{
    setTimeout(() => {
        return 1;//1sec bad wapas chale jao
    }, timeout);
}
// const waiting = async (timeout) => {
//     return new Promise(resolve => setTimeout(resolve, timeout));
// };


const submitToken=async(resultToken)=>{
        const options = {
          method: 'GET',
          url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
          params: {
            tokens:resultToken.join(","),
            base64_encoded: 'false',
            fields: '*'
          },
          headers: {
            'x-rapidapi-key': '245786d1b6msh2028680b7243a0dp19ba3djsn9bba74664eea',
            'x-rapidapi-host': 'judge0-ce.p.rapidapi.com'
          }
        };

        async function fetchData() {
          try {
            const response = await axios.request(options);
            return response.data;
          } catch (error) {
            console.error("error in submitToken",error);
            throw new Error("Failed to fetch result from Judge0"); // ✅ Rethrow
          }
        }
        while(true){
            const result=await fetchData();
            const IsResultObtained=result.submissions.every((value)=>value.status_id>2);

            if(IsResultObtained){
                    return result.submissions;
            }
              // send arr

            //if not then run again after 1sec 
            await waiting(1000);//1s 
        }
}

module.exports={getLanguageById,submitBatch,submitToken};


