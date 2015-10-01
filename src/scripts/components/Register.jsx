'use strict';

import React      from 'react';
import classNames from 'classnames';
import moment     from 'moment';
import _          from 'lodash';

import ExerciseActionCreators from '../actions/ExerciseActionCreators';
import ExerciseStore          from '../stores/ExerciseStore';
import RecordActionCreators   from '../actions/RecordActionCreators';
import RecordStore            from '../stores/RecordStore';
import Record                 from '../components/Record';

const WEIGHTS = [60, 80, 100, 120, 140, 160, 180];
const REPS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

export default class Register extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      exercises: ExerciseStore.getAll(),
      date: moment().format('YYYY-MM-DD'),
      currentExercise: null,
      currentWeight: null,
      records: []
    }

    this.handleExerciseStore = () => {
      this.setState({exercises: ExerciseStore.getAll()});
    };

    this.handleRecordStore = () => {
      this.context.history.pushState(null, '/result');
    };

    this.handleDateChange = () => {
      const date = this.refs.dateField.value;
      this.setState({date: date});
    };

    this.handleExerciseChange = (e) => {
      const exercise = parseInt(e.currentTarget.value);
      this.setState({currentExercise: exercise});
    };

    this.handleExerciseKeyDown = (e) => {
      if (e.key === 'Enter') {
        this.addExercise();
      }
    };

    this.handleExerciseClick = () => {
      this.addExercise();
    };

    this.handleWeightClick = (weight) => {
      this.setState({currentWeight: weight});
    };

    this.handleWeightChange = () => {
      const weight = this.refs.weightField.value;
      this.setState({currentWeight: weight});
    };

    this.handleAddRepClick = (rep) => {
      const records = this.state.records;
      const timestamp = Date.now();
      const exercise = this.state.currentExercise;
      const weight = this.state.currentWeight;

      if (!exercise) {
        alert('exercise is not selected');
        return;
      }
      if (!weight) {
        alert('weight is not selected');
        return;
      }

      const record = {
        id: timestamp,
        exercise: exercise,
        weight: weight,
        rep: rep
      };
      records.push(record);
      this.setState({records: records});
    };

    this.handleRemoveClick = (id) => {
      const records = this.state.records;
      _.remove(records, (record) => record.id === id);
      this.setState({records: records});
    }

    this.handleSubmitClick = () => {
      const date = this.state.date;
      const records = this.state.records;

      if (!date) {
        alert('date is not inputed');
        return;
      }
      if (!records.length) {
        alert('records is empty');
        return;
      }

      if (confirm('記録を登録しますか？')) {
        RecordActionCreators.add(date, records);
      }
    };
  }

  addExercise() {
    const exerciseField = this.refs.exerciseField;
    const name = exerciseField.value.trim();

    if (!name) {
      alert('exercise name is empty');
      return;
    }

    ExerciseActionCreators.add(name);
    exerciseField.value = '';
  }

  componentDidMount() {
    ExerciseStore.addListener('addExercise', this.handleExerciseStore);
    RecordStore.addListener('addRecord', this.handleRecordStore);
  }

  componentWillUnmount() {
    ExerciseStore.removeListener('addExercise', this.handleExerciseStore);
    RecordStore.removeListener('addRecord', this.handleRecordStore);
  }

  render() {
    return (
      <div className="rw-main">
        <h2>記録を追加</h2>

        <div className="rw-section">
          <h3>日付</h3>

          <p>
            <input
             ref="dateField"
             className="form-control"
             type="date"
             value={this.state.date}
             onChange={this.handleDateChange.bind(this)} />
          </p>
        </div>

        <div className="rw-section">
          <h3>種目</h3>

          {this.state.exercises.length ?
            <p>
              {this.state.exercises.map((exercise) => [
                <input
                 id={`exercise-${exercise.id}`}
                 type="radio"
                 name="exercise"
                 value={exercise.id}
                 checked={this.state.currentExercise === exercise.id}
                 hidden
                 onChange={this.handleExerciseChange.bind(this)} />,

                <label
                 className="rw-btn-select"
                 htmlFor={`exercise-${exercise.id}`}>{exercise.name}</label>
              ])}
            </p>
          : null}

          <p>
            <input
             ref="exerciseField"
             type="text"
             onKeyDown={this.handleExerciseKeyDown.bind(this)} />

            <button
             className="rw-btn-reflect"
             onClick={this.handleExerciseClick.bind(this)}>追加</button>
          </p>
        </div>

        <div className="rw-section">
          <h3>重量</h3>

          <p>
            {WEIGHTS.map((weight, i) => {
              const classes = {
                'rw-btn-reflect': true,
                'rw-btn-reflect--active': parseFloat(this.state.currentWeight) === weight
              };
              return (
                <button
                 key={i}
                 className={classNames(classes)}
                 onClick={this.handleWeightClick.bind(this, weight)}>{weight} kg</button>
              );
            })}
          </p>

          <p>
            <label>
              <input
               ref="weightField"
               type="number"
               min="1"
               max="500"
               step="0.5"
               value={this.state.currentWeight}
               onChange={this.handleWeightChange.bind(this)} /> kg
            </label>
          </p>
        </div>

        <div className="rw-section">
          <h3>レップ数</h3>

          <p>
            {REPS.map((rep, i) =>
              <button
               key={i}
               className="rw-btn-reflect"
               onClick={this.handleAddRepClick.bind(this, rep)}>{rep}</button>
            )}
          </p>
        </div>

        <div className="rw-panel">
          <h3>{this.state.date ? `${this.state.date} の記録` : '日付を選択してください'}</h3>

          <Record
           exercises={this.state.exercises}
           records={this.state.records}
           edit={true}
           onDelete={this.handleRemoveClick.bind(this)} />

          <p className="form-actions">
            <button
             className="rw-btn-submit"
             onClick={this.handleSubmitClick.bind(this)}>記録を登録</button>
          </p>
        </div>
      </div>
    );
  }
}

Register.contextTypes = {
  history: React.PropTypes.object
};
