/* eslint-disable react/destructuring-assignment */
/* @flow */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { Animated, Easing } from 'react-native';

import color from 'color';

import ToggleButton from '../ToggleButton';
import * as Colors from '../colors';

import { isIphoneX } from '../util/platform';

import type { ThemeDefault } from '../types/ThemeType';

type Props = {
    +leftElementTestID?: string | null,
    +isSearchActive: boolean,
    +size?: number,
    +leftElement?: string | any,
    +onLeftElementPress?: Function,
    +onSearchClose?: Function,
    +theme: ThemeDefault,
    +orientation: 'portrait' | 'landscape'
};

type State = {
    +leftElement: string | typeof undefined,
    +spinValue: Animated.Value
};

const SEARCH_FORWARD_ICON = 'arrow-forward';

class LeftElement extends PureComponent<Props, State> {
    static defaultProps = {
        leftElementTestID: null,
        leftElement: null,
        onLeftElementPress: null,
        onSearchClose: null,
        size: 24
    };

    static getDerivedStateFromProps(props: Props) {
        return {
            leftElement: props.isSearchActive
                ? SEARCH_FORWARD_ICON
                : props.leftElement
        };
    }

    constructor(props: Props) {
        super(props);

        this.state = {
            leftElement: props.isSearchActive
                ? SEARCH_FORWARD_ICON
                : props.leftElement,
            spinValue: new Animated.Value(props.isSearchActive ? 1 : 0)
        };
    }

    componentDidUpdate(prevProps: Props) {
        const { isSearchActive } = this.props;

        if (isSearchActive !== prevProps.isSearchActive) {
            this.animateIcon(isSearchActive);
        }
    }

    animateIcon = (activate: boolean) => {
        const { spinValue } = this.state;

        const toValue = activate ? 1 : 0;

        Animated.timing(spinValue, {
            toValue: 0.5,
            duration: 112,
            easing: Easing.linear,
            useNativeDriver: true
        }).start(() => {
            Animated.timing(spinValue, {
                toValue,
                duration: 112,
                easing: Easing.linear,
                useNativeDriver: true
            }).start();
        });
    };

    render() {
        const {
            leftElementTestID,
            isSearchActive,
            onLeftElementPress,
            onSearchClose,
            theme,
            orientation
        } = this.props;

        const { leftElement, spinValue } = this.state;

        if (!leftElement) {
            return null;
        }

        let onPress = onLeftElementPress;

        if (isSearchActive) {
            onPress = onSearchClose;
        }

        const spin = spinValue.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '180deg']
        });

        const animatedViewProps = {
            testID: leftElementTestID,
            style: {
                transform: [{ rotate: spin }],
                ...(orientation === 'landscape' && isIphoneX()
                    ? { paddingLeft: 32 }
                    : null)
            }
        };

        // eslint-disable-next-line prettier/prettier
        let iconColor = theme.variant === 'white'
                ? Colors.white[1000]
                : theme.palette.textColorPrimary;

        if (isSearchActive) {
            iconColor = theme.palette.textColorPrimary;
        }

        const toggleButtonProps = {
            ...(leftElementTestID ? { key: leftElementTestID } : null),
            iconName: leftElement,
            iconColor,
            rippleColor: color(theme.palette.colorPrimary).isDark()
                ? Colors.white[1000]
                : theme.palette.textColorPrimary,
            onPress
        };

        return (
            <Animated.View {...animatedViewProps}>
                <ToggleButton {...toggleButtonProps} />
            </Animated.View>
        );
    }
}

LeftElement.propTypes = {
    leftElementTestID: PropTypes.string,
    isSearchActive: PropTypes.bool.isRequired,
    size: PropTypes.number,
    leftElement: PropTypes.node,
    onLeftElementPress: PropTypes.func,
    onSearchClose: PropTypes.func,
    orientation: PropTypes.oneOf(['portrait', 'landscape']).isRequired
};

export default LeftElement;
