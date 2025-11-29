const str1="listen"
const str2="slient"

function areAnagrams(str1, str2) {
  let sortedStr1 = str1.split("").sort().join("");
  console.log(sortedStr1); // This will now log the sorted string correctly
  let sortedStr2 = str2.split("").sort().join("");

  return sortedStr1 === sortedStr2; // Use '===' for strict equality check
}

console.log(areAnagrams(str1,str2))