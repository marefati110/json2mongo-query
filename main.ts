import { isArray, isObject } from 'lodash';

export interface Json2mongo {
  data: Record<string, any>;
  prefix?: string;
}

export function Json2MongoQuery(obj: Record<string, any>, prefix = '') {
  const flatObj = {};

  for (const key in obj) {
    //
    const value = obj[key];

    // is object
    if (isObject(value)) {
      const isOperator = Object.keys(value).some((item) => item.includes('$'));

      if (!isOperator) {
        const nestedKeys = Json2MongoQuery(value, prefix + key + '.');
        Object.assign(flatObj, nestedKeys);
      } else {
        flatObj[`${prefix}${key}`] = value;
      }

      // is array
    } else if (isArray(value)) {
      value.forEach((item, index) => {
        if (typeof item === 'object') {
          const nestedKeys = Json2MongoQuery(item, `${prefix}${key}.${index}.`);
          Object.assign(flatObj, nestedKeys);
        } else {
          flatObj[`${prefix}${key}.${index}`] = item;
        }
      });
      // other types
    } else {
      //
      flatObj[`${prefix}${key}`] = value;
    }
  }

  return flatObj;
}
