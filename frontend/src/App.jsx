import  {Routes,Route,Navigate, NavLink} from "react-router";
import Homepage from "./pages/Homepage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { useDispatch,useSelector } from "react-redux";
import { checkAuth } from "./slice/authSlice";
import { useEffect } from "react";
import ProblemPage from "./pages/problempage"
import Admin from "./pages/Admin";
import AdminCreate from "./component/admincreate";
import AdminUpdate from "./component/adminupdate";
import AdminDelete from "./component/admindelete";
import AdminVideo from "./component/AdminVideo";
import AdminUpload from "./component/AdminUpload";


function App() {

  const dispatch=useDispatch();
  const {isAuthenticated,user}=useSelector((state)=>state.auth);
  
  useEffect(()=>{
      dispatch(checkAuth());
  },[])

  return (
    <>
       <Routes>
           <Route path="/" element={isAuthenticated?<Homepage></Homepage>:<Navigate to="/signup"></Navigate>}></Route>
           <Route path="/login" element={<Login></Login>}></Route>
           <Route path="/signup" element={<Signup></Signup>}></Route>
           <Route path="/admin" element={isAuthenticated && user?.role=="admin"?<Admin/>:<Navigate to="/"></Navigate>}></Route>
           <Route path="/admin/create" element={isAuthenticated && user?.role=="admin"?<AdminCreate/>:<Navigate to="/"></Navigate>}></Route>
           <Route path="/admin/update" element={isAuthenticated && user?.role=="admin"?<AdminUpdate/>:<Navigate to="/"></Navigate>}></Route>
           <Route path="/admin/delete" element={isAuthenticated && user?.role=="admin"?<AdminDelete/>:<Navigate to="/"></Navigate>}></Route>
           <Route path="/admin/video" element={isAuthenticated && user?.role=="admin"?<AdminVideo/>:<Navigate to="/"></Navigate>}></Route>
           <Route path="/admin/upload/:problemId" element={isAuthenticated && user?.role === 'admin' ? <AdminUpload /> : <Navigate to="/" />} />
           {/* different page of problem made with this sabhi ke problem page wala function chalan hai  */}
           <Route path="/problem/:problemId" element={<ProblemPage/>}></Route>
       </Routes>
    </>
  )
}

export default App;
