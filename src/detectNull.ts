import _ from 'lodash';

export const detectNull = (value?: string) =>
  _.isString(value) && value.toLowerCase() === 'null' ? null : value;
