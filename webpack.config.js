'use strict';

import webpack from 'webpack';

export default {
  output: {
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      { test: /\.jsx?$/, exclude: /node_modules/, loader: 'babel' }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  }
};
