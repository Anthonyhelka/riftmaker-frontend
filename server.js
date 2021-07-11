const express = require('express');
const path = require('path');

const app = express();

app.use(express.static(__dirname + '/dist/riftmaker-frontend'));

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname + '/dist/riftmaker-frontend/index.html'));
});

app.listen(process.env.PORT || 8080);

console.log('Console Listening!');
