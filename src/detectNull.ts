import { isString } from 'is-what';

export const detectNull = (value?: string) =>
  isString(value) && value.toLowerCase() === 'null' ? null : value;
