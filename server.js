const express = require('express');
const app = express();
const port = 3000;

app.use('/static', express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
})

app.get('/visualizer/[a-z1-9]*$', (req, res) => {
  res.sendFile(__dirname + '/public/visualizer.html');
})

app.listen(port, () => {
  console.log(`Visualizer app listening at http://localhost:${port}`);
});
