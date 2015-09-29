'use strict';

import { EventEmitter } from 'events';
import AppDispatcher from '../dispatcher/AppDispatcher';
import Util from '../utils';

const keyName = 'rw_exercises';

class ExerciseStore extends EventEmitter {
  constructor() {
    super();
    this.data = Util.storage(keyName);
    AppDispatcher.addListener('addExercise', this.onAdd.bind(this));
  }
  getAll() {
    return this.data;
  }
  onAdd(name) {
    const timeStamp = Date.now();
    this.data.push({id: timeStamp, name: name});
    Util.storage(keyName, this.data);
    this.emit('addExercise');
  }
}

export default new ExerciseStore();
