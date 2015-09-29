'use strict';

import AppDispatcher from '../dispatcher/AppDispatcher';

class RecordActionCreators {
  constructor() {
    this.dispatcher = AppDispatcher;
  }
  add(date, records) {
    this.dispatcher.emit('addRecord', date, records);
  }
}

export default new RecordActionCreators();
