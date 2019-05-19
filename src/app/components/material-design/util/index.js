/* eslint-disable import/prefer-default-export */
/* @flow */

import lodashIsEmpty from 'lodash.isempty';

import Color from 'color';

export function isEmpty(value: any): boolean {
    return lodashIsEmpty(value);
}

export function isFunction(obj: any): boolean {
    return !!(obj && obj.constructor && obj.call && obj.apply);
}

export function colorRgba(color: string, alpha: number): string {
    return Color(color)
        .alpha(alpha)
        .toString();
}
