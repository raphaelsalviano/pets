/* @flow */

import { createTheming } from '@callstack/react-theme-provider';

import type { ThemingType } from '@callstack/react-theme-provider';

import { ThemeWhite } from './theme';

import type { ThemeDefault } from '../types/ThemeType';

const {
    ThemeProvider,
    withTheme
}: ThemingType<ThemeDefault, $Shape<ThemeDefault>> = createTheming(ThemeWhite);

export { ThemeProvider, withTheme };
