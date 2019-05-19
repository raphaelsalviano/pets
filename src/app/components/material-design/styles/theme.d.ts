/* @flow */

import { Theme } from '../types/ThemeType';
import { any } from 'prop-types';

export interface typography {
    h1: {
        fontWeight: string,
        fontSize: number,
        letterSpacing: number
    },
    h2: {
        fontWeight: string,
        fontSize: number,
        letterSpacing: number
    },
    h3: {
        fontWeight: string,
        fontSize: number,
        letterSpacing: number
    },
    h4: {
        fontWeight: string,
        fontSize: number,
        letterSpacing: number
    },
    h5: {
        fontWeight: string,
        fontSize: number,
        letterSpacing: number
    },
    h6: {
        fontWeight: string,
        fontSize: number,
        letterSpacing: number
    },
    subtitle1: {
        fontWeight: string,
        fontSize: number,
        letterSpacing: number
    },
    subtitle2: {
        fontWeight: string,
        fontSize: number,
        letterSpacing: number
    },
    body1: {
        fontWeight: string,
        fontSize: number,
        letterSpacing: number
    },
    body2: {
        fontWeight: string,
        fontSize: number,
        letterSpacing: number
    },
    button: {
        fontWeight: string,
        fontSize: number,
        letterSpacing: number
    },
    caption: {
        fontWeight: string,
        fontSize: number,
        letterSpacing: number
    },
    overline: {
        fontWeight: string,
        fontSize: number,
        letterSpacing: number
    }
}

declare const theme: {
    variant: 'white' | 'dark',
    palette: Theme,
    icoFontRes?: any,
    typography: typography
};

export default theme;