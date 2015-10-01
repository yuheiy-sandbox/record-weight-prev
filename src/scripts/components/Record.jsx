'use strict';

import React      from 'react';
import classNames from 'classnames';
import _          from 'lodash';

export default class Record extends React.Component {
  constructor(props) {
    super(props);

    this.onDelete = (id) => {
      this.props.onDelete(id);
    };
  }

  getExerciseName(exerciseId) {
    return _.find(this.props.exercises, {id: exerciseId}).name;
  }

  getWeights(exerciseId) {
    const reps = _.filter(this.props.records, {exercise: exerciseId});
    return _.uniq(_.pluck(reps, 'weight'));
  }

  getRepData(exerciseId, weight) {
    return _.filter(this.props.records, {exercise: exerciseId, weight: weight});
  }

  get exercises() {
    const records = this.props.records;
    const allExercises = _.uniq(_.pluck(records, 'exercise'));
    const exerciseFilter = this.props.exerciseFilter;

    if (!records.length) {
      return false;
    }
    if (exerciseFilter !== -1) {
      return allExercises.indexOf(exerciseFilter) !== -1 ? [exerciseFilter] : false;
    }

    return allExercises;
  }

  render() {
    return (
      this.exercises ?
        <table className="rw-record">
          <tbody className="rw-record__tbody">
            {this.exercises.map((exerciseId) =>
              <tr
               key={exerciseId}
               className="rw-record__row">
                <th className="rw-record__name">{this.getExerciseName(exerciseId)}</th>

                {this.getWeights(exerciseId).map((weight) => [
                  <td className="rw-record__weight">{weight} kg</td>,

                  <td className="rw-record__reps">
                    {this.props.edit ?
                      this.getRepData(exerciseId, weight).map((datum) =>
                        <button
                         key={datum.id}
                         className="rw-btn-reflect"
                         onClick={this.onDelete.bind(this, datum.id)}>{datum.rep}</button>)

                    : this.getRepData(exerciseId, weight).map((datum) => {
                        const classes = {
                          'rw-btn-reflect': true,
                          'rw-btn-reflect--disabled': true,
                        };

                        return (
                          <span
                           key={datum.id}
                           className={classNames(classes)}>{datum.rep}</span>
                        );
                      })
                    }
                  </td>
                ])}
              </tr>
            )}
          </tbody>
        </table>
      : <p>データが登録されていません。</p>
    );
  }
}

Record.defaultProps = {
  exercises: [],
  exerciseFilter: -1,
  records: [],
  edit: false
};

Record.propTypes = {
  exercises: React.PropTypes.array,
  exerciseFilter: React.PropTypes.number,
  records: React.PropTypes.array,
  edit: React.PropTypes.bool,
  onDelete: React.PropTypes.func
};
