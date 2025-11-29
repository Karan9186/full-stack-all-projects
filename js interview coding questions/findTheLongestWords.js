const sentence="hi i am karan i am skilled in very good"

const findTheLongestWords=(sentence)=>{
  const words=sentence.split(" ")
  let longestWords=""
  for (let word of words){
    if(word.length > longestWords.length){
      longestWords=word
    }
  }
  return longestWords
}

console.log(findTheLongestWords(sentence))