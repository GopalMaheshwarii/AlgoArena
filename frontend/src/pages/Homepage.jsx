import { useDispatch, useSelector } from "react-redux";
import { FileQuestion, UserPen } from 'lucide-react';
import { NavLink} from "react-router";
import { useEffect, useState } from "react";
import { checkAuth, logoutUser } from "../slice/authSlice";
import { useForm } from "react-hook-form";
import axiosClient from '../utils/axiosClient';
import { CheckCheck } from 'lucide-react';
import 'bootstrap-icons/font/bootstrap-icons.css';

function Homepage(){
   let {user,loading}=useSelector((state)=>state.auth);
   let dispatch=useDispatch();
   const [problems,setproblems]=useState([]);
   const [filterproblems,setfilterproblems]=useState([]);
   const [solvedproblems,setsolvedproblems]=useState([]);
   let  [currentitems,setcurrentitems]=useState([]);
   let [pageno,setpageno]=useState(1);
   

   useEffect(()=>{
      const fetchProblems=async()=>{
        try{
            const response=await axiosClient.get("/problem/getAllProblem");
            const response2=await axiosClient.get("/problem/problemSolvedByUser");
            setproblems(response.data);
            setfilterproblems(response.data);
            if(response2.data==null)
            setsolvedproblems([]);
            console.log()
            setsolvedproblems(response2.data);
        }
        catch(error){
            console.log("error fetching problems",error);
        }
    }
    fetchProblems();
   },[]);
    
   const { register, handleSubmit, watch, formState: { errors } } = useForm();
   // const [problemFilter,setproblemFilter]=useState([""]);
   
   const onSubmit = (filters)=>{
        console.log(filters);
        let arrfilter=[];
        if(filters.status=="all"){
             arrfilter=problems;
        }
        else{
             arrfilter=solvedproblems;
        }
        if(filters.difficulty!="all")
             arrfilter=arrfilter.filter((ques)=>ques?.difficulty==filters?.difficulty);
        if(filters.tag!="all")
             arrfilter=arrfilter.filter((ques)=>ques?.tags==filters?.tag);
         setfilterproblems([...arrfilter]);
        
   };

   useEffect(()=>{
         const limit=10;
         const startIndex =(pageno-1)*limit;
         const endIndex=startIndex+limit<=filterproblems.length?startIndex+limit:filterproblems.length;
         setcurrentitems(filterproblems.slice(startIndex, endIndex));

        },[pageno, filterproblems]);

   useEffect(()=>{
        dispatch(checkAuth());
   },[])

   function handleLogout(){
      dispatch(logoutUser());
   }

   function Makingdifficultytag({tag}){
       switch(tag){
         case "easy":{
           return <div className="badge badge-success">Easy</div>
         }
         case "medium":{
             return <div className="badge badge-warning">Medium</div>
         }
         case "hard":{
              return <div className="badge badge-error">Hard</div>
         }
         default:
              return <div className="badge">Unknown</div>;
       }
   }

   function Card({index,title,difficulty,tag,id}){
      
      return (
         <tr className="bg-base-200">
            <th>{index+1}</th>
            <td><NavLink to={`/problem/${id}` } className="hover:underline">{title}</NavLink></td>
            <td><Makingdifficultytag tag={difficulty}/></td>
            <td><div className="badge badge-outline badge-info">{tag}</div></td>
            <th className={solvedproblems.some((ques)=> ques && ques._id==id)?"text-green-500":""}><CheckCheck className="" /></th>
         </tr>
      )
   }
   
 return (
    <div> 
      {/* dropdown */}
         <div className="navbar bg-base-200 shadow-sm mb-5">
         <div className="flex-1">
            <a className="ml-10 font-bold text-xl">AlgoArena </a>
         </div>
         <div className="flex">
            <div className="flex items-center mr-5">{user?.firstName}</div>
            <div className="dropdown dropdown-end">
               <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
               <div className="w-10 rounded-full pt-2">
                <UserPen></UserPen>
               </div>
               </div>
               <ul
               tabIndex={0}
               className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
               {user.role=="admin" && ( <li><NavLink to="/admin">Admin</NavLink></li> )}
               <li><button onClick={handleLogout}>Logout</button></li>
               
               </ul>
            </div>
         </div>
         </div>
      
      {/* selection */}
      <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-row justify-center gap-4">
         <div className="w-60">
            <select {...register("status")} className="select" defaultValue="all">
            <option value="all" >All Problems</option>
            <option value="solved">Solved Problems</option>
            </select>
         </div>

         <div className="w-60">
            <select {...register("difficulty")} className="select" defaultValue="all">
            <option value="all">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
            </select>
         </div>

         <div className="w-60">
            <select {...register("tag")} className="select" defaultValue="all">
            <option value="all" >All Tags</option>
            <option value="array">Array</option>
            <option value="linkedlist">Linked List</option>
            <option value="graph">Graph</option>
            <option value="dp">DP</option>
            </select>
         </div>
         <button type="submit" className="btn btn-primary">Apply</button>
      </div>
      </form>

      <div className="overflow-x-auto mt-5 p-10 pb-3">
      <table className="table">
         {/* head */}
         <thead>
            <tr>
            <th>#</th>
            <th>Name</th>
            <th>Difficulty</th>
            <th>Topic</th>
            <th>Solved</th>
            </tr>
         </thead>
         <tbody>
            {
              currentitems.map((ques,index)=><Card key={ques?._id||index} index={index} title={ques.title} tag={ques.tags} difficulty={ques.difficulty} id={ques._id} />)
            }
            
         </tbody>
      </table>
      </div>
       <div className="flex justify-end pt-0 p-10">
           <div className="join ">
                     <button
                        className="join-item btn  btn-neutral btn-dash bg-gray-200 text-black font-bold text-2xl hover:scale-120"
                        onClick={() => setpageno(pageno === 1 ? 1 : pageno - 1)}
                     >
                        «
                     </button>

                     <button className="join-item btn btn-outline bg-white hover:scale-120">Page {pageno}</button>

                     <button
                        className="join-item btn btn-neutral btn-dash  bg-gray-200 text-black font-bold text-2xl hover:scale-120"
                        disabled={pageno >=Math.ceil(filterproblems.length / 6 -1)}
                        onClick={() => setpageno(pageno + 1)}
                        >
                        »
                     </button>
                        
               </div>

               
       </div>
       <div className="p-6 bg-gray-200 flex flex-col items-center gap-10">
                      <div className="flex gap-3">
                           <a href="" className="bg-black text-white pr-1 pl-1 opacity-75 hover:opacity-100"><i class="bi bi-facebook"></i></a>
                           <a href="" className="bg-black text-white pr-1 pl-1 opacity-75 hover:opacity-100"><i class="bi bi-instagram"></i></a>
                           <a href="" className="bg-black text-white pr-1 pl-1 opacity-75 hover:opacity-100"><i class="bi bi-linkedin"></i></a>
                      </div>
                      <div className="opacity-75 hover:opacity-100">
                          <i class="bi bi-c-circle"></i> <a href="">AlgoArena Private Limited</a>
                      </div>
                      <div className="opacity-75 hover:opacity-100">
                        <a href=""> Privacy terms</a> 
                      </div>
               </div> 


    </div>
 )
}
export default Homepage;