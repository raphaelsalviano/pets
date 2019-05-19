/* @flow */

import * as React from 'react';

import { ThemeDefault } from '../types/ThemeType';

import { SearchableProps } from './AppBar';

export interface RightActionsProps {
    actions?: Array<string | any>,
    menu?: {
        icon?: string,
        labels: Array<string>
    }
}

export interface RightElementProps {
    rightElementID?: string,
    isSearchActive: boolean,
    searchValue: string,
    searchable?: SearchableProps,
    size?: number,
    rightElement?:
        | any
        | string
        | Array<string>
        | RightActionsProps,
    onRightElementPress: Function,
    onSearchClearRequest: Function,
    onSearchPress: Function,
    theme: ThemeDefault,
    orientation: 'portrait' | 'landscape'
}

declare const RightElement: React.ComponentType<RightElementProps>;

export default RightElement;