var currPath="M 10 100 Q 500 100 990 100";
var finalPath="M 10 100 Q 500 100 990 100";

// var mainCont=document.querySelector(".mainCont");

// mainCont.addEventListener("mousemove",function(e){
//   currPath=`M 10 100 Q ${e.x} ${e.y} 990 100`;
//   gsap.to("svg path",{
//     attr:{d:currPath},
//     duration:2,
//     ease:"power3.out"
//   })
// })
// mainCont.addEventListener("mouseleave",function(e){
//   gsap.to("svg path",{
//     attr:{d:finalPath},
//     duration:2,
//     ease:"elastic.out(1,0.2)"
//   })
// })

var mintCont=document.querySelector(".mainCont");
mintCont.addEventListener("mousemove",function(e){
  currPath=`M 10 100 Q ${e.x  } ${e.y} 990 100`;
  gsap.to("svg path",{
    attr:{d:currPath},
    duration:2,
    ease:"power3.out"
  })
})

mintCont.addEventListener("mouseleave",function(e){
  gsap.to("svg path",{
    attr:{d:finalPath},
    duration:2,
    ease:"elastic.out(1,0.2)"
  })
})