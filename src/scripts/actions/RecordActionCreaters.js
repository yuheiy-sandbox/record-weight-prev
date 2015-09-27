'use strict';

import AppDispatcher from '../dispatcher/AppDispatcher';

class RecordActions {
  constructor() {
    this.dispatcher = AppDispatcher;
  }
  addRecord(data) {
    console.log('record: action to store');
    this.dispatcher.emit('addRecord', data);
  }
}

export default new RecordActions();
