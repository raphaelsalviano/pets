/* @flow */

import { Theme } from '../types/ThemeType';

export interface theme {
    colorPrimary: string,
    colorPrimaryDark: string,
    colorAccent: string,
    colorControlHighlight?: string, // ripple color
    colorControlNormal?: string, // color decoration intens (example arrow spinner)
    colorSwitchThumbNormal?: string, // color switch - usually accentColor
    colorBackground?: string,
    colorOverlay?: string,
    colorDivider?: string,
    textColorPrimary?: string, // text primary
    textColorSecondary?: string, // text hint
    textColorTertiary?: string, // text disable
    textColorError?: string,
    fontFamily?: string
}

declare const theme: theme;

export default theme;