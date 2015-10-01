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
const MIN_WEIGHT = 1;
const MAX_WEIGHT = 500;
const REPS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

export default class Register extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      exercises: ExerciseStore.getAll(),
      date: moment().format('YYYY-MM-DD'),
      currentExercise: null,
      currentWeight: null,
      errorDateField: false,
      errorExerciseSelect: false,
      errorExerciseField: false,
      errorWeightField: false,
      errorRecord: false,
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
      this.setState({date: date, errorDateField: false});
    };

    this.handleExerciseChange = (e) => {
      const exercise = parseInt(e.currentTarget.value);
      this.setState({currentExercise: exercise, errorExerciseSelect: false});
    };

    this.handleExerciseFieldKeyDown = (e) => {
      if (e.key === 'Enter') {
        this.addExercise();
      }
    };

    this.handleExerciseFieldClick = () => {
      this.addExercise();
    };

    this.handleExerciseFieldChange = () => {
      this.setState({errorExerciseField: false});
    };

    this.handleWeightClick = (weight) => {
      if (weight >= MIN_WEIGHT && weight <= MAX_WEIGHT) {
        this.setState({currentWeight: weight});
      }
      if (weight <= MIN_WEIGHT) {
        this.setState({currentWeight: MIN_WEIGHT});
      }
      if (weight >= MAX_WEIGHT) {
        this.setState({currentWeight: MAX_WEIGHT});
      }
      this.setState({errorWeightField: false});
    };

    this.handleWeightChange = () => {
      const weight = this.refs.weightField.value;
      this.setState({currentWeight: parseFloat(weight), errorWeightField: false});
    };

    this.handleAddRepClick = (rep) => {
      const records = this.state.records;
      const timestamp = Date.now();
      const exercise = this.state.currentExercise;
      const weight = this.state.currentWeight;
      let error = false;

      if (!exercise) {
        this.setState({errorExerciseSelect: true});
        error = true;
      }
      if (!weight) {
        this.setState({errorWeightField: true});
        error = true;
      }
      if (error) { return; }

      const record = {
        id: timestamp,
        exercise: exercise,
        weight: weight,
        rep: rep
      };
      records.push(record);
      this.setState({records: records, errorRecord: false});
    };

    this.handleRemoveClick = (id) => {
      const records = this.state.records;
      _.remove(records, (record) => record.id === id);
      this.setState({records: records});
    }

    this.handleResetClick = () => {
      if (confirm('入力された記録をリセットします。よろしいですか？')) {
        this.setState({
          date: moment().format('YYYY-MM-DD'),
          currentExercise: null,
          currentWeight: null,
          records: []
        });
      }
    };

    this.handleSubmitClick = () => {
      const date = this.state.date;
      const records = this.state.records;
      let error = false;

      if (!date) {
        this.setState({errorDateField: true});
        error = true;
      }
      if (!records.length) {
        this.setState({errorRecord: true});
        error = true;
      }
      if (error) { return; }

      if (confirm('記録を登録しますか？')) {
        RecordActionCreators.add(date, records);
      }
    };
  }

  addExercise() {
    const exerciseField = this.refs.exerciseField;
    const name = exerciseField.value.trim();

    if (!name) {
      this.setState({errorExerciseField: true});
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
    const dateClasses = {
      'form': true,
      'errored': this.state.errorDateField
    };

    const exerciseClasses = {
      'form': true,
      'errored': this.state.errorExerciseField
    };

    const weightClasses = {
      'form': true,
      'errored': this.state.errorWeightField
    };

    return (
      <div className="rw-main">
        <h2>記録を追加</h2>

        <div className="rw-section">
          <h3>日付</h3>

          <dl className={classNames(dateClasses)}>
            <dt hidden>日付</dt>
            <dd>
              <input
               ref="dateField"
               className="form-control rw-form-plain"
               type="date"
               value={this.state.date}
               onChange={this.handleDateChange.bind(this)} />
            </dd>
            <dd className="error">日付が選択されていません。</dd>
          </dl>
        </div>

        <div className="rw-section">
          <h3>種目</h3>

          {this.state.errorExerciseSelect ?
            <p className="text-closed">種目が選択されていません。</p>
          : null}

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
          : <p>トレーニング種目を追加してください。</p>}

          <dl className={classNames(exerciseClasses)}>
            <dt hidden>追加する種目</dt>
            <dd>
              <input
               ref="exerciseField"
               className="rw-form-plain"
               type="text"
               placeholder="例）スクワット"
               onChange={this.handleExerciseFieldChange.bind(this)}
               onKeyDown={this.handleExerciseFieldKeyDown.bind(this)} />

              <button
               className="rw-btn-reflect"
               onClick={this.handleExerciseFieldClick.bind(this)}>追加</button>
            </dd>
            <dd className="error">種目が入力されていません。</dd>
          </dl>
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

          <dl className={classNames(weightClasses)}>
            <dt hidden>追加する重量</dt>
            <dd>
              <label>
                <input
                 ref="weightField"
                 type="number"
                 min={MIN_WEIGHT}
                 max={MAX_WEIGHT}
                 step="0.5"
                 value={this.state.currentWeight}
                 onChange={this.handleWeightChange.bind(this)} /> kg
              </label>

              <button
               className="rw-btn-reflect"
               onClick={this.handleWeightClick.bind(this, this.state.currentWeight - 5)}>- 5</button>

              <button
               className="rw-btn-reflect"
               onClick={this.handleWeightClick.bind(this, this.state.currentWeight + 5)}>+ 5</button>
            </dd>
            <dd className="error">重量が選択されていません。</dd>
          </dl>
        </div>

        <div className="rw-section">
          <h3>レップ数</h3>

          {this.state.errorRecord ?
            <p className="text-closed">データが追加されていません。</p>
          : null}

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
          <h3>
            {this.state.date ? `${this.state.date} の記録` : '日付を選択してください'}
            <span
             className="rw-trash"
             onClick={this.handleResetClick.bind(this)} />
          </h3>

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
