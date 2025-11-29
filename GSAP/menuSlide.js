var tl=gsap.timeline();
tl.to("#full",{
  right:0,
  duration:1
})

tl.from("#full h4",{
  x:150,
  duration:1,
  stagger:0.2,
  opacity:0
})
tl.from("#full i",{
  opacity:0,
  right:20
})
tl.pause()

var menu=document.querySelector("#nav i");
menu.addEventListener("click",function(){
  tl.play()
})

var close=document.querySelector("#full i");
close.addEventListener("click",function(){
  tl.reverse()
})