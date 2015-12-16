'use strict';

import express  from 'express';
import path     from 'path';

const app   = express();

app.use('/record-weight', express.static(__dirname + '/dist'));

app.get('*', (req, res) => {
  res.set('Content-Type', 'text/html');
  res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
});

export default app;
