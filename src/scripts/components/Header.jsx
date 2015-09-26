'use strict';

import React from 'react';
import IndexLink from 'react-router/lib/IndexLink';

export default class Header extends React.Component {
  render() {
    return (
      <h1><IndexLink className="rw-logo" to="/">Record Your Weigth Training</IndexLink></h1>
    );
  }
}
