import { createSlice } from "@reduxjs/toolkit";

export const counterSlice=createSlice({
  name:"counter",
  initialState:{
    value:0
  },
  reducers:{
    increment:(prev)=>{
      prev.value+=1
    },
    decrement:(prev)=>{
      prev.value-=1
    },
    minor:(prev)=>{
      prev.value+=2
    },
    reset:(prev)=>{
      prev.value=0;
    },
    byNumber:(prev,num)=>{
      prev.value+=+num.payload;
    }
  }
})

export const {increment,decrement,minor,reset,byNumber}=counterSlice.actions
export default counterSlice.reducer