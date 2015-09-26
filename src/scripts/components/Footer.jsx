'use strict';

import React from 'react';

const year = '2015';
const authorUrl = '//yhey.me/';

export default class Footer extends React.Component {
  render() {
    return (
      <footer className="rw-footer">
        <p>© {year} <a href={authorUrl} target="_blank">Yuhei Yasuda</a></p>
      </footer>
    );
  }
}
