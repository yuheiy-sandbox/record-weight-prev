'use strict';

import React      from 'react';
import PropTypes  from 'react-router';
import classNames from 'classnames';
import moment     from 'moment';

import ExerciseActionCreaters from '../actions/ExerciseActionCreaters';
import ExerciseStore          from '../stores/ExerciseStore';
import RecordActionCreaters   from '../actions/RecordActionCreaters';
import RecordStore            from '../stores/RecordStore';

const WEIGHTS = [60, 80, 100, 120, 140, 160, 180];
const REPS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

/*
[
  {
    id: id,
    contents: [
      {
        weight: 80,
        reps: [8, 8, 8]
      }, {
        weight: 80,
        reps: [8, 8, 8]
      }, {
        weight: 80,
        reps: [8, 8, 8]
      }
    ]
  }
]
*/

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

    ExerciseStore.addListener('change', () => {
      this.setState({exercises: ExerciseStore.getAll()});
    });

    this.handleDateChange = () => {
      const date = this.refs.dateField.value;
      this.setState({date: date});
    };

    this.handleExerciseChange = (e) => {
      const exercise = parseInt(e.currentTarget.value);
      this.setState({currentExercise: exercise});
    };

    this.handleExerciseAddClick = () => {
      this.addExercise();
    };

    this.handleExerciseAddKeyDown = (e) => {
      if (e.keyCode !== 13) return;
      this.addExercise();
    };

    this.handleWeightClick = (weight) => {
      this.setState({currentWeight: weight});
    };

    this.handleWeightChange = () => {
      const weight = this.refs.weightField.value;
      this.setState({currentWeight: weight});
    };

    this.handleRepAddClick = (rep) => {
      const exercise = this.state.currentExercise;
      const weight = this.state.currentWeight;
      if (!exercise || !weight) return;

      const records = this.state.records;
      const addedRecords = records.map((record, i) => {
        if (record.id === exercise) {
          let index = -1;
          record.contents.forEach((content, i) => {
            if (content.weight === weight) index = i;
          });

          if (index === -1) {
            record.contents.push({weight: weight, reps: [rep]});
          } else {
            record.contents[index].reps.push(rep);
          }
        }
        return record;
      });

      this.setState({records: addedRecords});
    };

    this.handleRepRemoveClick = () => {
      console.log('remove');
    };

    this.handleSubmitClick = () => {
      console.log('登録');
    };
  }

  readyRecord() {
    const records = this.state.records;

    this.state.exercises.forEach(exercise => {
      const exist = records.some(record => record.id === exercise.id);
      if (!exist) {
        records.push({id: exercise.id, contents: []});
      }
    });

    this.setState({records: records});

    console.log(records);
  }

  addExercise() {
    const name = this.refs.exerciseField.value;
    if (!name) return;
    ExerciseActionCreaters.add(name);
    this.refs.exerciseField.value = '';
  }

  componentDidMount() {
    this.readyRecord();
  }

  componentWillUnMount() {
    //
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
              {this.state.exercises.map(exercise =>
                <span key={exercise.id}>
                  <input
                   id={`exercise-${exercise.id}`}
                   type="radio"
                   name="exercise"
                   value={exercise.id}
                   checked={this.state.currentExercise === exercise.id}
                   hidden
                   onChange={this.handleExerciseChange.bind(this)} />
                  <label
                   className="rw-btn-select"
                   htmlFor={`exercise-${exercise.id}`}>{exercise.name}</label>
                </span>
              )}
            </p>
          : null}

          <p>
            <input
             ref="exerciseField"
             type="text"
             onKeyDown={this.handleExerciseAddKeyDown.bind(this)} />
            <button
             className="rw-btn-reflect"
             onClick={this.handleExerciseAddClick.bind(this)}>追加</button>
          </p>
        </div>

        <div className="rw-section">
          <h3>重量</h3>
          <p>
            {WEIGHTS.map((weight, i) => {
              const classes = {
                'rw-btn-reflect': true,
                'rw-btn-reflect--active': parseInt(this.state.currentWeight) === weight
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
               onChange={this.handleWeightChange.bind(this)} />kg
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
               onClick={this.handleRepAddClick.bind(this, rep)}>{rep}</button>
            )}
          </p>
        </div>

        <div className="rw-panel">
          <h3>{this.state.date ? `${this.state.date} の記録` : '日付を選択してください'}</h3>

          {this.state.records.some(record => record.contents.length) ?
            <table className="rw-record rw-record--centered">
              <tbody className="rw-record__tbody">
                {this.state.records.filter(record => record.contents.length).map(record =>
                  <tr key={record.id} className="rw-record__row">
                    <th className="rw-record__name">{this.state.exercises.filter(exercise => exercise.id === record.id)[0].name}</th>




                  </tr>
                )}
              </tbody>
            </table>
          : null}




          <table className="rw-record rw-record--centered">
            <tbody className="rw-record__tbody">
              <tr className="rw-record__row">
                <th className="rw-record__name">スクワット</th>
                <th className="rw-record__weight">80 kg</th>
                <td className="rw-record__reps">
                  <button
                   className="rw-btn-reflect"
                   onClick={this.handleRepRemoveClick.bind(this)}>6</button>
                </td>
              </tr>
            </tbody>
          </table>

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
