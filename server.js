'use strict';

import express  from 'express';
import path     from 'path';

const app = express();

app.use('/', express.static('dist'));

app.use((req, res) => {
  res.set('Content-Type', 'text/html');
  res.sendFile(path.resolve(__dirname, 'dist/index.html'));
});

export default app;
