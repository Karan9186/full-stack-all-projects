var main=document.querySelector("#main");
var cursor=document.querySelector("#dot")
main.addEventListener("mousemove",function(po){
  gsap.to("#dot",{
    x:po.x,
    y:po.y,
    duration:0.3,
    ease:"elastic.out"
  })
})


var image=document.querySelector(".image")
image.addEventListener("mouseenter",function(){

  gsap.to(cursor,{
    scale:4.2,
    backgroundColor:"red"
  })
  gsap.to(".image img",{
    transform:`rotateX(180deg)`,
    transform:`rotateY(180deg)`
  })
  console.log(e)

})

image.addEventListener("mouseleave",function(){

  gsap.to(cursor,{
    scale:1,
    backgroundColor:"white"
  })
  gsap.to(".image img",{
    transform:"rotateX(0deg)",
    transform:"rotateY(0deg)",
  })

})