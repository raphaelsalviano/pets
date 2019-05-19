/* @flow */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

import { withTheme } from '../styles';

import type { ThemeDefault } from '../types/ThemeType';

export type IconProps = {
    +size?: number,
    +name: string,
    +color?: ?string,
    /**
     * @optional
     */
    +theme: ThemeDefault
};

type Props = IconProps;

class Icon extends PureComponent<Props> {
    static defaultProps = {
        size: 24,
        color: null
    };

    render() {
        const { size, name, color, theme } = this.props;

        if (theme.icoFontRes) {
            const CustonIcon = createIconSetFromIcoMoon(theme.icoFontRes);

            const custonIconProps = {
                size,
                name,
                color: color || theme.palette.textColorPrimary
            };

            return <CustonIcon {...custonIconProps} />;
        }

        const materialIconProps = {
            size,
            name,
            color: color || theme.palette.textColorPrimary
        };

        return <MaterialIcon {...materialIconProps} />;
    }
}

Icon.propTypes = {
    size: PropTypes.number,
    name: PropTypes.string.isRequired,
    color: PropTypes.string
};

export default withTheme(Icon);
