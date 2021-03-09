const app = require('express')();
const http = require('http').createServer(app);
const port = 8081

app.get('/', (req, res) => {
  res.send('<h1>Hello world</h1>');
});

http.listen(port, () => {
  console.log(`Citadels game server listening on http://localhost:${port}`);
});