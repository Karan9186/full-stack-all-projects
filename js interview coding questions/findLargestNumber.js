const arr=[1,2,3,4,5]

const findLargest=(arr)=>{
  let largest=-1
  for(let num of arr){
    if(num > largest){
      largest=num
    }
  }
  return largest
}

console.log(findLargest(arr))