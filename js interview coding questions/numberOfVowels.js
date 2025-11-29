const str="hello world uu a"

const countNumberOfVowels=(str)=>{
  let count=0
  const vowels=["a","e","i","o","u"]
  const char=str.split("")
  for (let c of char){
    if(vowels.includes(c)){
      count++;
    }
  }
  return count
}

console.log(countNumberOfVowels(str))