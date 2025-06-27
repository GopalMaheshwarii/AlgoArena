import { useDispatch, useSelector } from "react-redux";
import { NavLink} from "react-router";
import { useEffect, useState } from "react";
import { checkAuth, logoutUser } from "../slice/authSlice";
import { useForm } from "react-hook-form";
import axiosClient from '../utils/axiosClient';
import {Upload ,Trash2} from 'lucide-react';

function AdminVideo(){
   let {user,loading}=useSelector((state)=>state.auth);
   let dispatch=useDispatch();
   const [problems,setproblems]=useState([]);
   const [filterproblems,setfilterproblems]=useState([]);
   const [solvedproblems,setsolvedproblems]=useState([]);
    const [againfetch,setagainfetch]=useState(true);
   useEffect(()=>{
      let fetchProblems=async()=>{
        try{
            const response=await axiosClient.get("/problem/getAllProblem");
            const response2=await axiosClient.get("/problem/problemSolvedByUser");
            setproblems(response.data);
            setfilterproblems(response.data);
            setsolvedproblems(response2.data);
        }
        catch(error){
            console.log("error fetching problems",error);
        }
    }
    fetchProblems();
   },[againfetch]);
    
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
             arrfilter=arrfilter.filter((ques)=>ques.difficulty==filters.difficulty);
        if(filters.tag!="all")
             arrfilter=arrfilter.filter((ques)=>ques.tags==filters.tag);
         setfilterproblems([...arrfilter]);
         setcount(0);
   };

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
        async function deleteProblem(){
            if (!window.confirm('Are you sure you want to delete this problem?')) return;
            try{
         
                await axiosClient.delete(`/video/delete/${id}`);
                alert("Tutorial deleted succesfully");
                setagainfetch(prev=>!prev);
            }
            catch(error){
                alert("Tutorial not deleted succesfully");
            }
        
      }
      
      return (
         <tr className="bg-base-200">
            <th>{index+1}</th>
            <td><NavLink to={`/problem/${id}`}>{title}</NavLink></td>
            <td><Makingdifficultytag tag={difficulty}/></td>
            <td><div className="badge badge-outline badge-info">{tag}</div></td>
            <th className=""><button className="text-red-600" onClick={deleteProblem}><Trash2></Trash2></button></th>
            <th className=""><button className="text-green-700" > <NavLink 
                        to={`/admin/upload/${id}`}
                        className={`btn`}
                        ><Upload></Upload></NavLink></button></th>
         </tr>
      )
   }
 return (
    <div> 
      {/* dropdown */}
         <div className="navbar bg-base-200 shadow-sm mb-5">
         <div className="flex-1">
            <a className="ml-10 font-bold text-2xl">Delete Problems</a>
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

      <div className="overflow-x-auto mt-5 p-10 ">
      <table className="table">
         {/* head */}
         <thead>
            <tr>
            <th>#</th>
            <th>Name</th>
            <th>Difficulty</th>
            <th>Topic</th>
            <th>Delete</th>
            <th>Upload</th>
            </tr>
         </thead>
         <tbody>
            {
              filterproblems.map((ques,index)=><Card key={ques?._id||index} index={index} title={ques.title} tag={ques.tags} difficulty={ques.difficulty} id={ques._id} />)
            }
            
         </tbody>
      </table>
      </div>

    </div>
 )
}


export default AdminVideo;