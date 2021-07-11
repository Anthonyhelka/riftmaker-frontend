const express = require('express');
const path = require('path');

const app = express();

app.use(express.static('./dist/riftmaker-frontend'));

app.get('/*', (req, res) =>
  res.sendFile('index.html', {root: 'dist/riftmaker-frontend/'}),
);

app.listen(process.env.PORT || 8080);
