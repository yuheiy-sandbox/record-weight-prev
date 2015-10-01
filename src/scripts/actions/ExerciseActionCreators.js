'use strict';

import AppDispatcher from '../dispatcher/AppDispatcher';

class ExerciseActionCreaters {
  constructor() {
    this.dispatcher = AppDispatcher;
  }

  add(name) {
    this.dispatcher.emit('addExercise', name);
  }

  deleteAll() {
    this.dispatcher.emit('deleteAllExercises');
  }
}

export default new ExerciseActionCreaters();
