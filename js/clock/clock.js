setInterval(getDate, 1000);

function getDate(){
  let now = new Date();
  let hours = now.getHours();
  let minutes = now.getMinutes();
  let seconds = now.getSeconds();
  document.getElementById("h1ForClock").textContent=`${hours}:${minutes}:${seconds}`;
}
getDate()