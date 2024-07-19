import _ from 'lodash';
import { inspect } from 'util';
import { z } from 'zod';

export const validateObjectPropertyUnique = (
  data: object,
  ctx: z.RefinementCtx,
  objectPath: string | string[],
  childLabel: string,
  propertyPath: string | string[],
) => {
  const objectPathArray = _.castArray(objectPath).filter((v) => !!v);

  const propertyPathArray = _.castArray(propertyPath).filter((v) => !!v);
  if (!propertyPathArray.length)
    throw new Error('propertyPath must not be empty');

  const propertyKey = _.last(propertyPathArray) ?? '';

  const obj = _.get(data, objectPathArray) as object;

  const groups = _.groupBy(
    _.entries(obj),
    _.property([1, ...propertyPathArray]),
  );

  for (const [property, dupes] of _.entries(groups))
    if (dupes.length > 1)
      for (const [childKey] of dupes as [string, unknown][])
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `duplicate ${propertyKey} '${property}' on ${childLabel} '${childKey}'`,
          path: [...objectPathArray, childKey, ...propertyPathArray],
        });
};
