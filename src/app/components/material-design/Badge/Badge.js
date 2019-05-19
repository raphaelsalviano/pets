/* @flow */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { StyleSheet, Animated } from 'react-native';

import { withTheme } from '../styles';

import * as Colors from '../colors';

import type { ThemeDefault } from '../types/ThemeType';

type Props = {
    +visible?: boolean,
    +children?: ?string | ?number,
    +size?: number,
    +color?: ?string,
    +theme: ?ThemeDefault,
    +style?: any
};

type State = {
    +opacity: Animated.Value
};

const styles = StyleSheet.create({
    container: {
        alignSelf: 'flex-end',
        textAlign: 'center',
        textAlignVertical: 'center',
        paddingHorizontal: 4,
        overflow: 'hidden'
    }
});

class Badge extends PureComponent<Props, State> {
    static defaultProps = {
        visible: false,
        children: null,
        size: 8,
        color: null,
        style: null
    };

    constructor(props: Props) {
        super(props);

        this.state = {
            opacity: new Animated.Value(props.visible ? 1 : 0)
        };
    }

    componentDidUpdate(prevProps: Props) {
        const { visible } = this.props;
        const { opacity } = this.state;

        if (visible !== prevProps.visible) {
            Animated.timing(opacity, {
                toValue: visible ? 1 : 0,
                duration: 150,
                useNativeDriver: true
            }).start();
        }
    }

    render() {
        const { children, size, color, style, theme } = this.props;
        const { opacity } = this.state;

        // eslint-disable-next-line prettier/prettier
        const { backgroundColor = Colors.pink.A200 || color, ...restStyle } = StyleSheet.flatten(style) || {};
        const textColor = Colors.white[1000];

        // $FlowFixMe
        const borderRadius = size / 2;

        const badgeProps = {
            numberOfLines: 1,
            style: [
                {
                    opacity,
                    backgroundColor,
                    color: textColor,
                    // $FlowFixMe
                    fontFamily: theme.palette.fontFamily,
                    // $FlowFixMe
                    ...theme.typography.overline,
                    height: size,
                    minWidth: size,
                    borderRadius
                },
                styles.container,
                restStyle
            ]
        };

        return <Animated.View {...badgeProps}>{children}</Animated.View>;
    }
}

Badge.propTypes = {
    visible: PropTypes.bool,
    children: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    size: PropTypes.number,
    color: PropTypes.string,
    style: PropTypes.any
};

export default withTheme(Badge);
