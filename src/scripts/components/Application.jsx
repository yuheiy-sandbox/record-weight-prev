'use strict';

import React    from 'react';
import { Link } from 'react-router';

import Header from './Header';
import Footer from './Footer';

export default class Application extends React.Component {
  render() {
    return (
      <div className="rw-container">
        <Header />
        {this.props.children}
        <Footer />
      </div>
    );
  }
}
