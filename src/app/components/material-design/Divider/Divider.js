/* @flow */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { View } from 'react-native';

import Color from 'color';

import { withTheme } from '../styles';

import * as Colors from '../colors';

import type { ThemeDefault } from '../types/ThemeType';

type Props = {
    +color: ?string,
    /**
     * @optional
     */
    theme: ThemeDefault
};

class Divider extends PureComponent<Props> {
    static defaultProps = {
        color: null
    };

    render() {
        const { color, theme } = this.props;

        // eslint-disable-next-line operator-linebreak
        const tempColor =
            (theme.variant === 'dark'
                ? Colors.white[1000]
                : Colors.black[1000]) || color;

        const style = {
            width: '100%',
            height: 1,
            backgroundColor: Color(tempColor)
                .alpha(0.12)
                .toString()
        };

        return <View style={style} />;
    }
}

Divider.propTypes = {
    color: PropTypes.string
};

export default withTheme(Divider);
