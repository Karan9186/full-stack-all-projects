var tl=gsap.timeline();

tl.from("h2",{
  duration: 1,
  y: -47,
  opacity:0,
  delay:0.4
})

tl.from("li",{
  duration: 1,
  y: -20,
  opacity:0,
  stagger:0.3
})

tl.from("h1",{
  duration: 1,
  opacity:0,
  scale:0.4
})