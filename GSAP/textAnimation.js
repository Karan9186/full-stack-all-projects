function breacTheText(){
  let h1=document.querySelector("h1");
let h1tag=document.querySelector("h1").textContent
let spiltedH1=h1tag.split("")
let width=Math.floor(spiltedH1.length)/2

let cuter="";
let newH1=spiltedH1.forEach((el,i)=>{
  if(i<width){
    cuter=cuter +  `<span class="a">${el}</span>`
  }
  else{
    cuter=cuter +  `<span class="b">${el}</span>`
  }
  if(i==width-1){
    cuter=cuter +  `<span style="margin-left:40px"></span>`
  }

})
h1.innerHTML=cuter

}
breacTheText()

gsap.from("h1 .a",{
  opacity:0,
  y:80,
  delay:0,
  stagger:0.1,
})
gsap.from("h1 .b",{
  opacity:0,
  y:80,
  delay:0,
  stagger:-0.1,
})