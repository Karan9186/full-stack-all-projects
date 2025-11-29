gsap.from(".page1 .box1",{
  rotate:360,
  duration: 1,
  delay:1,
  scale:.2,
  borderRadius:100
})

gsap.from(".page2 .box2",{
  rotate:360,
  duration: 1,
  delay:0,
  opacity:0,
  borderRadius:100,
  scrollTrigger:{
    trigger:".page2 .box2",
    scroller:"body",
    start:"top 90%",
    markers:true,
    opacity:1,
    scrub:true
  }
})
gsap.from(".page3 .box3",{
  duration: 1,
  delay:0,
  opacity:0,
  scale:0.5,
  borderRadius:100,
  scrollTrigger:{
    trigger:".page3 .box3",
    scroller:"body",
    start:"top 100%",
    opacity:1,
    markers:true,
    scale:2.5,
    borderRadius:0,
    scrub:true
  }
})

gsap.to(".page4 h1",{
    transform:"translate(-200%)",
    scrollTrigger:{
      trigger:".page4",
      scroller:"body",
      markers:true,
      start:"top 0%",
      end:"top -100%",
      scrub:3,
      pin:true
    }
})