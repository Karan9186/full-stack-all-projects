let arr=[1,2,3,4,4,5,3,3,1,2]

const removeDuplicate=(arr)=>{
  const uniqEle=[]
  for(let i = 0; i < arr.length; i++){
    if(uniqEle.indexOf(arr[i]) === -1){ //return index of element, if not then -1 return 
      uniqEle.push(arr[i])
    }
  }
  return uniqEle
}

const anotherMethod=(arr)=>{
  return [...new Set(arr)]
}

console.log(removeDuplicate(arr))