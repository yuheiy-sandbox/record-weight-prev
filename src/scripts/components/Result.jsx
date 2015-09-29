'use strict';

import React from 'react';

import ExerciseStore  from '../stores/ExerciseStore';
import RecordStore    from '../stores/RecordStore';
import Record         from '../components/Record';

export default class Result extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      exercises: ExerciseStore.getAll(),
      exerciseFilter: null,
      records: RecordStore.getAll().reverse()
    };

    this.handleExerciseChange = (e) => {
      const exerciseId = parseInt(e.currentTarget.value);
      this.setState({exerciseFilter: exerciseId});
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
              {this.state.exercises.map((exercise) =>
                <span key={exercise.id}>
                  <input
                   id={`exercise-${exercise.id}`}
                   type="radio"
                   name="exercise"
                   value={exercise.id}
                   checked={this.state.exerciseFilter === exercise.id}
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

        {this.state.records.map((record) =>
          <div
           key={record.id}
           className="rw-section">
            <h3>{record.date} の記録</h3>

            <Record
             exercises={this.state.exercises}
             exerciseFilter={this.state.exerciseFilter}
             records={record.records} />
          </div>
        )}
      </div>
    );
  }
}
