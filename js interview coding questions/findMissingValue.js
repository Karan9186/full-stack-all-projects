const num=[1,2,3,4,5,6,9]

const findMissing=(num)=>{
  const maxVaue=Math.max(...num)
  const minVaue=Math.min(...num)
  const missing=[]
  for(let i = minVaue; i < maxVaue; i++){
    if(num.indexOf(i) < 0){
      missing.push(i)
    }
  }
  return missing
}

console.log(findMissing(num))