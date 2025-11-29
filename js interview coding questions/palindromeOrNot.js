let str="racecar"

const findIsPalidDromOrNot=(str)=>{
  let revStr=str.split("").reverse().join("")
  console.log(revStr,str)
  return str==revStr
}

console.log(findIsPalidDromOrNot(str))