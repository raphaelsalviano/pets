/* @flow */

import * as React from 'react';

export interface SearchableProps {
    onChangeText?: Function,
    onSearchClosed?: Function,
    onSearchCloseRequested?: Function,
    onSearchPressed?: Function,
    onSubmitEditing?: Function,
    placeholder?: string,
    autoFocus?: boolean,
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters',
    autoCorrect?: boolean
}

export interface AppBarProps {
    imgSource?: number,
    isSearchActive?: boolean,
    searchable?: any,
    hidden?: boolean,
    onCenterElementPress?: Function,
    leftElement?: string | any,
    onLeftElementPress?: Function,
    centerElement?: string | any,
    rightElement?: string | any,
    onRightElementPress?: Function
}

declare const AppBar: React.ComponentType<AppBarProps>;

export default AppBar;