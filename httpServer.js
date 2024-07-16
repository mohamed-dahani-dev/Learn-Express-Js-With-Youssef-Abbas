// Create HTTP Server
const http = require("http");
const server = http.createServer((req, res) => {
  if (req.url == "/") {
    res.write("<h1>Hello from http server</h1>");
    res.end(); // stop the refresh process or end the response
  }
});

const port = 3000;
server.listen(port, () => {
  console.log("the server is listening on port " + port);
});
