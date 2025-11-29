const http = require("http");
const server = http.createServer((req, res) => {
  res.end("called");
});

server.listen(4000, () => {
  console.log("called");
});
