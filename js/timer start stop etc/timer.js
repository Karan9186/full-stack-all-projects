let timeH1=document.getElementById("timerShow")
let time=0;
let startTimeIntervelId;

function startTime(){
  startTimeIntervelId=setInterval(()=>{
  time++;
  timeH1.textContent=time
},1000)
}
let btnStart=document.querySelector(".start").addEventListener("click",()=>{
  startTime()
})

function stopTime(){
clearInterval(startTimeIntervelId)
}
let btnStop=document.querySelector(".stop").addEventListener("click",()=>{
  stopTime()
})

function resetTime(){
  clearInterval(startTimeIntervelId)
  time=0
  timeH1.textContent=time
}
let btnReset=document.querySelector(".reset").addEventListener("click",()=>{
  resetTime();
})

function getTime(){
  let alertTime=`the time is ${time}`;
    document.getElementById("getPara").textContent=alertTime
}
let btnGet=document.querySelector(".get").addEventListener("click",()=>{
  getTime()
})

function clearTime(){
  clearInterval(startTimeIntervelId)
  time=0
  timeH1.textContent=time
}

let btnClear=document.querySelector(".clear").addEventListener("click",()=>{
  clearTime()
})