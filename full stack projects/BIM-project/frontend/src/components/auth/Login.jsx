import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../services/user.service";
import toast from "react-hot-toast";
import { getLocalStorage, storeLocalStorage } from "../../../../backend/utils/GlobalLocalstorage";
import { LOCAL_STORAGE } from "../../../../backend/utils/constant";

const Login = () => {
  const navigate=useNavigate()
  const [userData,setUserData]=useState({
    email: "",
    password: "",
  })

  const handleChange=(e)=>{
    setUserData((prev)=>({...prev,[e.target.name]:e.target.value}))
  }

  const handleSubmit=async(e)=>{
    e.preventDefault();
    console.log("usedat",userData)
    const response=await loginUser(userData)
    console.log("-=-=-=-==",response)
    if(response?.success){
      toast.success(response?.message)
      storeLocalStorage(LOCAL_STORAGE.USER,JSON.stringify({userId:response?.data?.userId,email:response?.data?.email}))
      storeLocalStorage(LOCAL_STORAGE.TOKEN,response?.data?.token)
      navigate('/home')
    }
    else{
      toast.error(response?.message)
    }
  }

   useEffect(()=>{
      const getUser=getLocalStorage(LOCAL_STORAGE.TOKEN)
      if(getUser){
        navigate("/home")
      }
    },[])

  return (
    <>
      <div className="h-[100vh] flex items-center">
        <form className="w-md mb-22 mx-auto bg-white p-5 rounded-md shadow-md shadow-red-100" onSubmit={(e)=>handleSubmit(e)}>
          <div className="relative z-0 w-full mb-5 group">
            <input
              type="email"
              name="email"
              value={userData?.email}
              onChange={(e)=>handleChange(e)}
              id="floating_email"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-900 appearance-none dark:focus:border-red-500 focus:outline-none focus:ring-0 focus:border-red-600 peer"
              placeholder=" "
              required
            />
            <label
              for="floating_email"
              className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-red-600 peer-focus:dark:text-red-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Email address
            </label>
          </div>
          <div className="relative z-0 w-full mb-5 group">
            <input
              type="password"
              name="password"
              id="floating_password"
              value={userData?.password}
              onChange={(e)=>handleChange(e)}
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-black dark:border-gray-600 dark:focus:border-red-500 focus:outline-none focus:ring-0 focus:border-red-600 peer"
              placeholder=" "
              required
            />
            <label
              for="floating_password"
              className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-red-600 peer-focus:dark:text-red-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Password
            </label>
          </div>
          <button
            type="submit"
            className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm w-[100%] px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
          >
            Submit
          </button>
          <button className="mt-3 cursor-pointer text-blue-800 font-semibold" onClick={()=>navigate("/signup")} type="button">Not Have Account? SingUp Here</button>
        </form>
      </div>
    </>
  );
};

export default Login;
