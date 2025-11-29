let b=require('./script.js');
console.log(b);

var figlet = require("figlet");
figlet("karan parmar", function (err, data) {
  if (err) {
    console.log("Something went wrong...");
    console.dir(err);
    return;
  }
  console.log(data);
});