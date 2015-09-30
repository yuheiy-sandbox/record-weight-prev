'use strict';

import { EventEmitter } from 'events';
import AppDispatcher    from '../dispatcher/AppDispatcher';
import Util             from '../utils';

const keyName = 'rw_records';

class RecordStore extends EventEmitter {
  constructor() {
    super();
    this.data = Util.storage(keyName);
    AppDispatcher.addListener('addRecord', this.add.bind(this));
  }
  add(date, records) {
    const timestamp = Date.now();
    const datum = {id: timestamp, date: date, records: records};
    this.data.push(datum);
    Util.storage(keyName, this.data);
    this.emit('addRecord');
  }
  getAll() {
    return this.data;
  }
}

export default new RecordStore();
