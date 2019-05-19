/* @flow */

import * as React from 'react';

import { Theme } from '../types/ThemeType';

export interface MaterialThemeProvider {
    variant: 'white' | 'dark',
    theme?: Theme,
    icoFontRes?: any,
    children: React.ReactNode
}

declare const MaterialThemeProvider: React.ComponentType<MaterialThemeProvider>;

export default MaterialThemeProvider;