/* @flow */
import Color from 'color';

import * as Colors from '../colors';

import type { Theme } from '../types/ThemeType';

const theme: Theme = {
    colorPrimary: '#0e547c',
    colorPrimaryDark: '#053552',
    colorAccent: Colors.blue['500'],
    colorControlHighlight: Colors.grey['100'], // ripple color
    colorControlNormal: Colors.black['1000'], // color decoration intens (example arrow spinner)
    colorSwitchThumbNormal: Colors.blue['500'], // color switch - usually accentColor
    colorBackground: Colors.white['1000'],
    colorOverlay: Colors.black['1000_25'],
    colorDivider: Color(Colors.black['1000'])
        .alpha(0.25)
        .toString(),
    textColorPrimary: 'rgba(0, 0, 0, 0.87)', // text primary
    textColorSecondary: Color(Colors.black['1000'])
        .alpha(0.6)
        .toString(), // text hint
    textColorTertiary: Color(Colors.black['1000'])
        .alpha(0.38)
        .toString(), // text disable
    textColorError: '#b00020',
    fontFamily: 'Roboto'
};

export default theme;
