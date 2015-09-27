'use strict';

import AppDispatcher from '../dispatcher/AppDispatcher';

class ExerciseActions {
  constructor() {
    this.dispatcher = AppDispatcher;
  }
  add(data) {
    this.dispatcher.emit('changeExercise', data);
  }



  addExercise(data) {
    this.dispatcher.emit('addExercise', data);
  }
}

export default new ExerciseActions();
