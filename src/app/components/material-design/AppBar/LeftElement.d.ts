/* @flow */

import * as React from 'react';

import { ThemeDefault } from '../types/ThemeType';

export interface LeftElementProps {
    leftElementTestID?: string,
    isSearchActive: boolean,
    size?: number,
    leftElement?: string | any,
    onLeftElementPress?: Function,
    onSearchClose?: Function,
    theme: ThemeDefault,
    orientation: 'portrait' | 'landscape'
}

declare const LeftElement: React.ComponentType<LeftElementProps>;

export default LeftElement;