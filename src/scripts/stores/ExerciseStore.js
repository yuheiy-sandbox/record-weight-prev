'use strict';

import { EventEmitter } from  'events';
import AppDispatcher    from '../dispatcher/AppDispatcher';
import Util             from '../utils';

const keyName = 'rw_exercises';

class ExerciseStore extends EventEmitter {
  constructor() {
    super();
    this.data = Util.storage(keyName);
    AppDispatcher.addListener('addExercise', this.add.bind(this));
    AppDispatcher.addListener('deleteAllExercises', this.deleteAll.bind(this));
  }

  add(name) {
    const timestamp = Date.now();
    const datum = {id: timestamp, name: name};
    this.data.push(datum);
    Util.storage(keyName, this.data);
    this.emit('addExercise');
  }

  deleteAll() {
    this.data = [];
    Util.storage(keyName, this.data);
    this.emit('deleteAllExercises');
  }

  getAll() {
    return this.data;
  }
}

export default new ExerciseStore();
