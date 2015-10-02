'use strict';

import React  from 'react';
import _      from 'lodash';

import ExerciseActionCreators from '../actions/ExerciseActionCreators';
import ExerciseStore          from '../stores/ExerciseStore';
import RecordActionCreators   from '../actions/RecordActionCreators';
import RecordStore            from '../stores/RecordStore';
import Record                 from '../components/Record';

export default class Result extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      exercises: [],
      exerciseFilter: -1,
      records: [],
      errorDeleteExercise: false
    };

    this.handleExerciseStore = () => {
      this.setState({exercises: ExerciseStore.getAll()});
    };

    this.handleRecordStore = () => {
      this.setState({records: RecordStore.getAll()});
    };

    this.handleExerciseChange = (e) => {
      const exerciseId = parseInt(e.currentTarget.value);
      this.setState({exerciseFilter: exerciseId});
    };

    this.handleDeleteRecordClick = (recordId) => {
      if (confirm('記録を削除します。よろしいですか？')) {
        RecordActionCreators.delete(recordId);
      }
    };

    this.handleDeleteExerciseClick = (exerciseId) => {
      const isRegistered = this.state.records.some((record) =>
        record.reps.some((rep) => rep.exercise === exerciseId));

      if (isRegistered) {
        this.setState({errorDeleteExercise: true});
        return;
      }

      const exerciseName = _.find(this.state.exercises, {id: exerciseId}).name;

      if (confirm(`${exerciseName}を削除します。よろしいですか？`)) {
        ExerciseActionCreators.delete(exerciseId);
      }
    };

    this.handleAllDelete = () => {
      if (confirm('登録された全てのデータを削除します。よろしいですか？')) {
        ExerciseActionCreators.deleteAll();
        RecordActionCreators.deleteAll();
      }
    };
  }

  componentWillMount() {
    this.handleExerciseStore();
    this.handleRecordStore();
  }

  componentDidMount() {
    ExerciseStore.addListener('deleteExercise', this.handleExerciseStore);
    ExerciseStore.addListener('deleteAllExercises', this.handleExerciseStore);
    RecordStore.addListener('deleteRecord', this.handleRecordStore);
    RecordStore.addListener('deleteAllRecords', this.handleRecordStore);
  }

  componentWillUnmount() {
    ExerciseStore.removeListener('deleteExercise', this.handleExerciseStore);
    ExerciseStore.removeListener('deleteAllExercises', this.handleExerciseStore);
    RecordStore.removeListener('deleteRecord', this.handleRecordStore);
    RecordStore.removeListener('deleteAllRecords', this.handleRecordStore);
  }

  render() {
    return (
      <div className="rw-main">
        <h2>記録を見る</h2>

        {this.state.exercises.length ?
          <div className="rw-section">
            <h3>表示種目を選択</h3>
            <p>
              <input
               id="exercise-all"
               type="radio"
               name="exercise"
               value="-1"
               checked={this.state.exerciseFilter === -1}
               hidden
               onChange={this.handleExerciseChange.bind(this)} />

              <label
               className="rw-btn-select"
               htmlFor="exercise-all">全て表示</label>

              {this.state.exercises.map((exercise) => [
                <input
                 id={`exercise-${exercise.id}`}
                 type="radio"
                 name="exercise"
                 value={exercise.id}
                 checked={this.state.exerciseFilter === exercise.id}
                 hidden
                 onChange={this.handleExerciseChange.bind(this)} />,

                <label
                 className="rw-btn-select"
                 htmlFor={`exercise-${exercise.id}`}>{exercise.name}</label>
              ])}
            </p>
          </div>
        : null}

        {this.state.records.map((record) =>
          <div
           key={record.id}
           className="rw-section">
            <h3>
              {record.date} の記録
              <span
               className="rw-trash"
               title="記事を削除"
               onClick={this.handleDeleteRecordClick.bind(this, record.id)} />
            </h3>

            <Record
             exercises={this.state.exercises}
             exerciseFilter={this.state.exerciseFilter}
             records={record.reps} />
          </div>
        )}

        {this.state.exercises.length ?
          <div className="rw-section">
            <h3>登録した種目を削除</h3>
            {this.state.errorDeleteExercise ?
              <p className="text-error">記録が登録されている種目は削除できません。</p>
            : null}

            <p>
              {this.state.exercises.map((exercise) =>
                <button
                 key={exercise.id}
                 className="rw-btn-danger"
                 onClick={this.handleDeleteExerciseClick.bind(this, exercise.id)}>{exercise.name}</button>
              )}
            </p>
          </div>
        : null}

        {this.state.exercises.length || this.state.records.length ?
          <div className="rw-section">
            <h3>登録データを全て削除</h3>
            <p>登録された全てのデータを破棄します。</p>
            <p>
              <button
               className="rw-btn-danger"
               onClick={this.handleAllDelete.bind(this)}>全て削除</button>
            </p>
          </div>

        : <div className="rw-section">
            <p>データが登録されていません。</p>
          </div>}
      </div>
    );
  }
}
