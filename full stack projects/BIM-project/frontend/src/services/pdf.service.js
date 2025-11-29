import { PDF_ROUTE } from "./routes/routes";

export const getAllUserPdf=async(data)=>{
  try{
    const response=await fetch(PDF_ROUTE.GET,{
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
