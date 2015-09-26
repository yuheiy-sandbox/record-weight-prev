'use strict';

import React from 'react';
import { Link } from 'react-router';

export default class Header extends React.Component {
  render() {
    return (
      <div className="rw-main">
        <nav className="rw-menu">
          <Link className="rw-menu__link rw-menu__link--add" to="/register">記録を追加</Link>
          <Link className="rw-menu__link rw-menu__link--confirm" to="/confirm">記録を見る</Link>
        </nav>

        <div className="rw-panel">
          <h3>ウェイトトレーニングの記録を管理するツールです。</h3>
          <p>行った種目、重量、セット数などのトレーニング内容を記録することができます。</p>
          <p>筋トレを記録するツールが欲しかったので、個人用に作ったものです。<a href="//github.com/yuheiy/record-weight" target="_blank">ソースコードはこちらで公開しています。</a></p>
          <p>登録されたデータはブラウザに保存しています。<br />データが壊れることがあっても、制作側で保証することはできませんのでご了承ください。</p>
        </div>
      </div>
    );
  }
}
