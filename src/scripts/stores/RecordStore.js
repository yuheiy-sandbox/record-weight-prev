'use strict';

import _ from 'lodash';

import { EventEmitter } from 'events';
import AppDispatcher    from '../dispatcher/AppDispatcher';
import Util             from '../utils';

const keyName = 'rw_records';

class RecordStore extends EventEmitter {
  constructor() {
    super();
    this.data = Util.storage(keyName);
    AppDispatcher.addListener('addRecord', this.add.bind(this));
    AppDispatcher.addListener('deleteRecord', this.delete.bind(this));
    AppDispatcher.addListener('deleteAllRecords', this.deleteAll.bind(this));
  }

  add(date, records) {
    const timestamp = Date.now();
    const datum = {id: timestamp, date: date, records: records};
    this.data.push(datum);
    Util.storage(keyName, this.data);
    this.emit('addRecord');
  }

  delete(recordId) {
    _.remove(this.data, (record) => record.id === recordId);
    Util.storage(keyName, this.data);
    this.emit('deleteRecord');
  }

  deleteAll() {
    this.data = [];
    Util.storage(keyName, this.data);
    this.emit('deleteAllRecords');
  }

  getAll() {
    return _.sortBy(this.data, 'date').reverse();
  }
}

export default new RecordStore();
