'use strict';

import AppDispatcher from '../dispatcher/AppDispatcher';

class RecordActionCreators {
  constructor() {
    this.dispatcher = AppDispatcher;
  }

  add(date, records) {
    this.dispatcher.emit('addRecord', date, records);
  }

  delete(recordId) {
    this.dispatcher.emit('deleteRecord', recordId);
  }

  deleteAll() {
    this.dispatcher.emit('deleteAllRecords');
  }
}

export default new RecordActionCreators();
