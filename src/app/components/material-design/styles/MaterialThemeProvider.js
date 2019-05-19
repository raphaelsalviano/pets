/* eslint-disable prettier/prettier */
/* @flow */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import isEmpty from 'lodash.isempty';

import { ThemeProvider } from './createThemeProvider';

import { ThemeDark, ThemeWhite } from './theme';

import type { Theme, ThemeDefault } from '../types/ThemeType';

type Props = {
    +variant: 'white' | 'dark',
    +theme?: Theme,
    +icoFontRes?: any,
    +children: any
};

type State = {
    variant: string
};

class MaterialThemeProvider extends PureComponent<Props, State> {
    static defaultProps = {
        variant: 'white',
        theme: {},
        icoFontRes: null
    };

    constructor(props: Props) {
        super(props);

        this.state = {
            variant: props.variant
        };
    }

    static getDerivedStateFromProps(props: Props, state: State) {
        if (props.variant !== state.variant) {
            return {
                variant: props.variant
            };
        }

        return null;
    }

    render() {
        const { theme, children, icoFontRes } = this.props;

        const { variant } = this.state;

        let themeObject: ThemeDefault = ThemeWhite;

        if (variant === 'dark') {
            themeObject = ThemeDark;

            if (!isEmpty(theme)) {
                // $FlowFixMe
                themeObject.palette.colorAccent = theme.colorAccent || ThemeDark.palette.colorAccent;
                // $FlowFixMe
                themeObject.palette.colorSwitchThumbNormal = theme.colorSwitchThumbNormal || ThemeDark.palette.colorSwitchThumbNormal;
            }
        } else if (!isEmpty(theme)) {
            const tempTheme: Theme = Object.assign(
                {},
                themeObject.palette,
                theme
            );

            themeObject.palette = tempTheme;
        }

        if (icoFontRes) {
            // $FlowFixMe
            themeObject.icoFontRes = icoFontRes;
        }

        return <ThemeProvider theme={themeObject}>{children}</ThemeProvider>;
    }
}

MaterialThemeProvider.propTypes = {
    variant: PropTypes.oneOf(['white', 'dark']),
    theme: PropTypes.object,
    icoFontRes: PropTypes.any
};

export default MaterialThemeProvider;
