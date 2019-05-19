/* @flow */

import * as React from 'react';

import { ThemeDefault } from '../types/ThemeType';

export interface CenterElementProps {
    isSearchActive: boolean,
    searchValue: string,
    searchable?: {
        onSubmitEditing: Function,
        autoFocus: boolean,
        autoCapitalize: 'none' | 'sentences' | 'words' | 'characters',
        autoCorrect: boolean,
        onChangeText: Function,
        placeholder: string
    },
    centerElement: any,
    onPress: Function,
    onSearchTextChange: Function,
    theme: ThemeDefault
}

declare const CenterElement: React.ComponentType<CenterElementProps>;

export default CenterElement;