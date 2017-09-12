import {omitBy, isNil} from 'lodash';

export function purify(obj) {
    const isEmptyString = value => {
        if (typeof value === 'string' && value.length === 0) {
            return true;
        }
        return isNil(value)
    }
    return omitBy(obj, isEmptyString);
}