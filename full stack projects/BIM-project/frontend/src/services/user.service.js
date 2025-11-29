import { USER_ROUTES } from "./routes/routes"

export const registerUser=async(data)=>{
  try{
    const response=await fetch(USER_ROUTES.REGISTER,{
      method:"POST",
      headers:{
        "Content-Type":"application/json",
      },
      body:JSON.stringify(data),
    })
    return await response.json();
  }catch(err){
    console.log(err)
  }
}

export const loginUser=async(data)=>{
  try{
    const response=await fetch(USER_ROUTES.LOGIN,{
      method:"POST",
      headers:{
        "Content-Type":"application/json",
      },
      body:JSON.stringify(data),
    })
    return await response.json();
  }catch(err){
    console.log(err)
  }
}
