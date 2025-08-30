import { Operator } from './types';

export const operatorMap = (op: Operator, observed: number, target: number) => {
  switch (op) {
    case 'gt':
      return observed > target;
    case 'gte':
      return observed >= target;
    case 'lt':
      return observed < target;
    case 'lte':
      return observed <= target;
    case 'eq':
      return observed === target;
  }
};
