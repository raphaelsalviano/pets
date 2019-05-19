/* @flow */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { StyleSheet } from 'react-native';

import Typography from '../Typography';
import Ripple from '../RippleEffect';
import { withTheme } from '../styles';

import type { ThemeDefault } from '../types/ThemeType';

type Props = {
    +disabled?: boolean,
    +onPress?: Function,
    +theme: ThemeDefault,
    +children: any
};

const styles = StyleSheet.create({
    item: {
        height: 48,
        minWidth: 112,
        maxWidth: 280,
        paddingHorizontal: 16,
        alignItems: 'center',
        justifyContent: 'flex-start',
        flexDirection: 'row'
    }
});

class MenuItem extends PureComponent<Props> {
    static defaultProps = {
        disabled: false,
        onPress: null
    };

    onPress = () => {
        const { onPress } = this.props;

        if (onPress) {
            onPress();
        }
    };

    render() {
        const { disabled, children, theme } = this.props;

        const rippleProps = {
            style: styles.item,
            onPress: this.onPress,
            disabled
        };

        const typographyProps = {
            variant: 'body2',
            gutterBottom: false,
            styles: {
                color: disabled
                    ? theme.palette.textColorTertiary
                    : theme.palette.textColorPrimary
            }
        };

        return (
            <Ripple {...rippleProps}>
                <Typography {...typographyProps}>{children}</Typography>
            </Ripple>
        );
    }
}

MenuItem.propTypes = {
    disabled: PropTypes.bool,
    onPress: PropTypes.func
};

export default withTheme(MenuItem);
