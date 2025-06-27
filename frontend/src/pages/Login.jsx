import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { loginUser } from '../slice/authSlice';
import { useEffect,useState } from 'react';
import { useNavigate, NavLink} from 'react-router';
import { useSelector,useDispatch } from 'react-redux';
import { EyeOff,Eye} from 'lucide-react';


const loginSchema = z.object({
  emailId: z.string().email(),
  password: z.string().min(6)
});


function Login(){
    const {register,handleSubmit,formState: { errors },} = useForm({ resolver: zodResolver(loginSchema) });
    let dispatch=useDispatch();
    let navigate=useNavigate();
    let {isAuthenticated}=useSelector((state)=>state.auth)
    let [showpassword,setshowpassword]=useState(false);
    
  useEffect(()=>{
      if (isAuthenticated) {
          navigate('/');
      }
  },[isAuthenticated])

  const onSubmit = (data) => {
     dispatch(loginUser(data));
  };
   return (

       <div className='min-h-[100vh] flex justify-center items-center'>
          <div className="w-96 shadow-black shadow-xl p-4 rounded-2xl">
              <div className="text-3xl flex justify-center font-bold mb-2.5">AlgoArena</div>
              <div className="">
                    <form onSubmit={handleSubmit(onSubmit)}>
                           
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
                           
                            <div className="flex justify-center ">
                                <button type="submit" className="btn btn-primary">Login</button>
                            </div>
                            
                             <div className="mt-8 text-center">
                                  Don't have an account? <NavLink to="/signup" className="text-blue-400 underline">Sign Up</NavLink>
                            </div>
                            

                    </form>
              </div>
          </div>
      </div>
 )
}
export default Login;


