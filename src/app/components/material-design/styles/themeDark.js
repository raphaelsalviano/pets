/* @flow */
import Color from 'color';

import * as Colors from '../colors';

import type { Theme } from '../types/ThemeType';

const theme: Theme = {
    colorPrimary: Colors.grey['900'],
    colorPrimaryDark: Colors.black['1000'],
    colorAccent: Colors.blue['500'],
    colorControlHighlight: Colors.grey['100'], // ripple color
    colorControlNormal: Colors.white['1000'], // color decoration intens (example arrow spinner)
    colorSwitchThumbNormal: Colors.blue['500'], // color switch - usually accentColor
    colorBackground: '#303030',
    colorOverlay: Colors.black['1000_25'],
    colorDivider: Color(Colors.white['1000'])
        .alpha(0.12)
        .toString(),
    textColorPrimary: Colors.white['1000'], // text primary
    textColorSecondary: Color(Colors.white['1000'])
        .alpha(0.7)
        .toString(), // text hint
    textColorTertiary: Color(Colors.white['1000'])
        .alpha(0.5)
        .toString(), // text disable
    textColorError: '#F44336',
    fontFamily: 'Roboto'
};

export default theme;
