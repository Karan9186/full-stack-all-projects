let str="karan"

const reverseString=(str)=>{
  const char=str.split("")
  // console.log(char)
  let reverse=""
  for(let i=char.length-1;i>=0;i--){
    reverse+=char[i]
  }
  return reverse
}
console.log(reverseString(str))