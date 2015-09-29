'use strict';

import React from 'react';
import { Link } from 'react-router';

import ExerciseStore from '../stores/ExerciseStore';

export default class Header extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      exercises: ExerciseStore.getAll(),
      filterExercise: null,
      records: []
    };

    this.handleExerciseChange = (e) => {
      const exercise = parseInt(e.currentTarget.value);
      this.setState({filterExercise: exercise});
    };
  }

  render() {
    return (
      <div className="rw-main">
        <h2>記録を見る</h2>

        {this.state.exercises.length ?
          <div className="rw-section">
            <h3>特定種目のみ表示</h3>
            <p>
              {this.state.exercises.map(exercise =>
                <span key={exercise.id}>
                  <input
                   id={`exercise-${exercise.id}`}
                   type="radio"
                   name="exercise"
                   value={exercise.id}
                   checked={this.state.filterExercise === exercise.id}
                   hidden
                   onChange={this.handleExerciseChange.bind(this)} />
                  <label
                   className="rw-btn-select"
                   htmlFor={`exercise-${exercise.id}`}>{exercise.name}</label>
                </span>
              )}
            </p>
          </div>
        : null}

        {this.state.records.map(record =>
          <div className="rw-section">
            <h3>date</h3>
            <div>table</div>
          </div>
        )}
      </div>
    );
  }
}
