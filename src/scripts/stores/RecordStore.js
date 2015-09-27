'use strict';

import { EventEmitter } from 'events';
import AppDispatcher from '../dispatcher/AppDispatcher';
import Util from '../utils';

const keyName = 'rw_record';

class RecordStore extends EventEmitter {
  constructor() {
    super();
    AppDispatcher.addListener('addRecord', this.onAddRecord.bind(this));
  }
  getRecords() {
    //
  }
  onAddRecord(date, content) {
    console.log('record: store to component');
    this.emit('addRecordCompleted');
  }
}

export default new RecordStore();
