'use strict';

import React from 'react';

import ExerciseActionCreators from '../actions/ExerciseActionCreators';
import ExerciseStore          from '../stores/ExerciseStore';
import RecordActionCreators   from '../actions/RecordActionCreators';
import RecordStore            from '../stores/RecordStore';
import Record                 from '../components/Record';

export default class Result extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      exercises: ExerciseStore.getAll(),
      exerciseFilter: -1,
      records: RecordStore.getAll()
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

    this.handleDeleteClick = (recordId) => {
      if (confirm('記録を削除します。よろしいですか？')) {
        RecordActionCreators.delete(recordId);
      }
    };

    this.handleAllDelete = () => {
      if (confirm('登録された全てのデータを削除します。よろしいですか？')) {
        ExerciseActionCreators.deleteAll();
        RecordActionCreators.deleteAll();
      }
    };
  }

  componentDidMount() {
    ExerciseStore.addListener('deleteAllExercises', this.handleExerciseStore);
    RecordStore.addListener('deleteRecord', this.handleRecordStore);
    RecordStore.addListener('deleteAllRecords', this.handleRecordStore);
  }

  componentWillUnmount() {
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
               onClick={this.handleDeleteClick.bind(this, record.id)} />
            </h3>

            <Record
             exercises={this.state.exercises}
             exerciseFilter={this.state.exerciseFilter}
             records={record.records} />
          </div>
        )}

        {this.state.exercises.length || this.state.records.length ?
          <div className="rw-section">
            <h3>登録データを全て削除</h3>
            <p>登録された全てのデータを破棄します。</p>
            <p>
              <button
               className="rw-btn-reflect"
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
