import {createAsyncThunk,createSlice} from "@reduxjs/toolkit"
import axiosClient from "../utils/axiosClient"

export let registerUser=createAsyncThunk(
    "auth/register",
    async(userData,{rejectWithValue})=>{
        try{
            const response=await axiosClient.post("/user/register",userData);
            return response.data.user;
        }
        catch(error){
            return rejectWithValue(error);
        }
    }
)
export let loginUser=createAsyncThunk(
    "auth/login",
    async (credentials,{rejectWithValue})=>{
        try{
           const response=await axiosClient.post("/user/login",credentials);
           return response.data.user;
        }
         catch(error){
            return rejectWithValue(error);
        }
    }
)
export let logoutUser=createAsyncThunk(
    "auth/logout",
    async (arg,{rejectWithValue})=>{
         try{
            await axiosClient.post("/user/logout");
            return null;
         }
         catch(error){
            return rejectWithValue(error);
         }
    }
)
export let checkAuth=createAsyncThunk(
    "auth/check",
    async(__,{rejectWithValue})=>{
        try{
            const response=await axiosClient.get("/user/check");
            return response.data.user;
        }
        catch(error){
            return rejectWithValue(error);
        }
    }
)


const authSlice=createSlice({
    name:"auth",
    initialState:{
        user:null,
        isAuthenticated:false,
        loading:false,
        error:null
    },
    reducers:{
    },
    extraReducers:(builder)=>{
        //register 
        builder
        .addCase(registerUser.pending,(state)=>{
            state.loading=true;
            state.error=null;
        })
        .addCase(registerUser.fulfilled,(state,action)=>{
            state.user=action.payload
            state.loading=false;
            state.isAuthenticated=!!action.payload
            //i add !! because i want to give answer in boolean form 
            //ise  vah boolean me negation then again remove negation
        })
        .addCase(registerUser.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload?.message || "something went wrong";
            state.isAuthenticated=false;
            state.user=null;
        })
        //login
        .addCase(loginUser.pending,(state)=>{
            state.loading=true;
            state.error=null;
        })
        .addCase(loginUser.fulfilled,(state,action)=>{
            state.user=action.payload
            state.loading=false;
            state.isAuthenticated=!!action.payload
            //i add !! because i want to give answer in boolean form 
            //ise  vah boolean me negation then again remove negation
        })
        .addCase(loginUser.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload?.message || "something went wrong";
            state.isAuthenticated=false;
            state.user=null;
        })
        
        //logout
        .addCase(logoutUser.pending,(state)=>{
            state.loading=true;
            state.error=null;
        })
        .addCase(logoutUser.fulfilled,(state,action)=>{
            state.user=null
            state.loading=false;
            state.isAuthenticated=false
            state.error=null;
            //i add !! because i want to give answer in boolean form 
            //ise  vah boolean me negation then again remove negation
        })
        .addCase(logoutUser.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload?.message || "something went wrong";
            state.isAuthenticated=false;
            state.user=null;
        })

        // Check Auth Cases
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = !!action.payload;
        state.user = action.payload;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Something went wrong';
        state.isAuthenticated = false;
        state.user = null;
      })
            
        
    }
})


export default authSlice.reducer