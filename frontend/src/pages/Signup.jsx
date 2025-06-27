import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod'; 
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../slice/authSlice';
import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router';
import { EyeOff,Eye} from 'lucide-react';


const signupSchema = z.object({
  firstName: z.string().min(3),
  emailId:z.string().email(),
  password:z.string().min(8)
});

function Signup(){ 
    
     let dispatch=useDispatch();
     let navigate=useNavigate();
     let {isAuthenticated,loading}=useSelector((state)=>state.auth)
     let [showpassword,setshowpassword]=useState(false);
     
     const {register,handleSubmit,formState: { errors }} = useForm({resolver: zodResolver(signupSchema)});
     //it return an object 
     useEffect(()=>{
          if(isAuthenticated){
            navigate("/");
          }
     },[isAuthenticated])

     function submittedData(data){
        //it give json format data firstName:gopal
        dispatch(registerUser(data));
     }
     if(loading){
      return(
         <div>
           
         </div>
      )
   }
     
   return (
    
      <div className='min-h-[100vh] flex justify-center items-center'>
          <div className="w-96 shadow-black shadow-xl p-4 rounded-2xl">
              <div className="text-3xl flex justify-center font-bold mb-2.5">AlgoArena</div>
              <div className="">
                    <form onSubmit={handleSubmit(submittedData)}>
                           <div className="mb-4">
                            <label for="firstname" className="label mb-1">First Name</label>
                            <br></br>
                            <input type="text" placeholder="John" className={`input input-bordered ${errors.firstName && 'input-error'}`} {...register('firstName')}/>
                            {errors.firstName && (<p className="text-error">{errors.firstName.message}</p>)}
                            </div>

                            <div className="mb-4">
                            <label for="emailId" className="label mb-1">Email</label>
                            <br></br>
                            <input type="text" placeholder="John@gmail.com" className={`input input-bordered ${errors.emailId && 'input-error'}`} {...register('emailId')}/>
                            {errors.emailId && (<p className="text-error">{errors.emailId.message}</p>)}
                            </div>

                            <div className="mb-4 ">
                            <label for="password" className="label mb-1">Password</label>
                            <br></br>
                            <div className="relative">
                            <input type={showpassword ? "text" : "password"} placeholder="........" className={`input input-bordered ${errors.password && 'input-error'}`} {...register('password')}/>
                            <button type="button"
                                onClick={() => setshowpassword(!showpassword)}
                                className="absolute top-2 right-10 text-gray-500 hover:text-gray-700"
                              >
                                {showpassword ? <EyeOff /> : <Eye />}
                            </button>
                            </div>
                            {errors.password && (<p className="text-error">{errors.password.message}</p>)}
                            </div>
                           
                            <div className="flex justify-center ${loading ? 'loading' : ''}`">
                                <button type="submit" className="btn btn-primary" disabled={loading}> {loading ? 'Signing Up...' : 'Sign Up'}</button>
                            </div>

                            <div className="mt-8 text-center">
                                  Already have an account? <NavLink to="/login" className="text-blue-400 underline">Login</NavLink>
                            </div>
                    </form>
              </div>
          </div>
      </div>
 )
}
export default Signup;


//ise lagaya but it is too lengthy so we not use it even 
//validation in it  is not easy too 
//so we use react form hook for making form 
// and in we use zode for validation of data 


// import { useEffect, useState } from "react"


// function Signup(){

//     const [name,setName] = useState('');
//     const [email,setEmail] = useState('');
//     const [password,setPassword] = useState('');
   
//     const handleSubmit = (e)=>{
       
//         e.preventDefault();

//         console.log(name,email,password);
        
//         // validation
        
       

//         // Form ko submit kar denge
//         // Backend submit
        
//     }

//     return(
//         <form onSubmit={handleSubmit} className="min-h-screen flex flex-col justify-center items-center gap-y-3 ">
//           <input type="text" name="firstName" value={name} placeholder="Enter your firstName" onChange={(e)=>setName(e.target.value)}></input>
//           <input type="email" value={email} placeholder="Enter your Email" onChange={(e)=>setEmail(e.target.value)}></input>
//           <input type="password" value={password} placeholder="Enter your Password" onChange={(e)=>setPassword(e.target.value)}></input>
//           <button type="submit">Submit</button>
//         </form>
//     )
// }

// firstName: "Rohit"
// 

