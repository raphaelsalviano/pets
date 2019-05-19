/* eslint-disable prettier/prettier */
/* @flow */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import {
    StyleSheet,
    View,
    Animated,
    Easing,
    TouchableWithoutFeedback
} from 'react-native';

import type { PressEvent, LayoutEvent } from '../types/CoreEvents';

import * as Colors from '../colors';
import { withTheme } from '../styles';

import type { ThemeDefault } from '../types/ThemeType';

type Props = {
    delayLongPress?: number,
    delayPressIn?: number,
    delayPressOut?: number,
    hitSlop?: any,
    pressRetentionOffset?: any,
    onPress?: Function,
    onPressIn?: Function,
    testID?: string,
    nativeID?: string,
    accessible?: boolean,
    accessibilityLabel?: string,
    onPressOut?: Function,
    onLongPress?: Function,
    onLayout?: Function,
    color?: ?string,
    opacity?: number,
    duration?: number,
    size?: number,
    containerBorderRadius?: number,
    centered?: boolean,
    sequential?: boolean,
    fades?: boolean,
    disabled?: boolean,
    onRippleAnimation?: Function,
    children: any,
    /**
     * optional
     */
    theme: ThemeDefault
};

type State = {
    +width: number,
    +height: number,
    +ripples: Array<Object>
};

type Ripple = {
    +unique: number,
    +progress: Object,
    +locationX: number,
    +locationY: number,
    +R: number
};

const radius = 10;
const styles = StyleSheet.create({
    // eslint-disable-next-line react-native/no-unused-styles
    container: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'transparent',
        overflow: 'hidden'
    },
    ripple: {
        width: radius * 2,
        height: radius * 2,
        borderRadius: radius,
        overflow: 'hidden',
        position: 'absolute'
    }
});

class RippleEffect extends PureComponent<Props, State> {
    static defaultProps = {
        // $FlowFixMeProps
        ...TouchableWithoutFeedback.defaultProps,
        color: null,
        opacity: 0.3,
        duration: 400,
        size: 0,
        containerBorderRadius: 0,
        centered: false,
        sequential: false,
        fades: true,
        disabled: false,
        // eslint-disable-next-line prettier/prettier
        onRippleAnimation: (animation: Function, callback: any) => animation.start(callback)
    };

    unique: number;

    mounted: boolean;

    constructor(props: Props) {
        super(props);

        this.unique = 0;
        this.mounted = false;

        this.state = {
            width: 0,
            height: 0,
            ripples: []
        };
    }

    componentDidMount() {
        this.mounted = true;
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    onLayout = (event: LayoutEvent) => {
        const { width, height } = event.nativeEvent.layout;
        const { onLayout } = this.props;

        if (typeof onLayout === 'function') {
            onLayout(event);
        }

        this.setState({ width, height });
    };

    onPress = (event: PressEvent) => {
        const { ripples } = this.state;
        const { onPress, sequential } = this.props;

        if (!sequential || !ripples.length) {
            if (typeof onPress === 'function') {
                requestAnimationFrame(() => onPress(event));
            }

            this.startRipple(event);
        }
    };

    onLongPress = (event: PressEvent) => {
        const { onLongPress } = this.props;

        if (typeof onLongPress === 'function') {
            requestAnimationFrame(() => onLongPress(event));
        }

        this.startRipple(event);
    };

    onPressIn = (event: PressEvent) => {
        const { onPressIn } = this.props;

        if (typeof onPressIn === 'function') {
            onPressIn(event);
        }
    };

    onPressOut = (event: PressEvent) => {
        const { onPressOut } = this.props;

        if (typeof onPressOut === 'function') {
            onPressOut(event);
        }
    };

    onAnimationEnd = () => {
        if (this.mounted) {
            this.setState(({ ripples }) => ({ ripples: ripples.slice(1) }));
        }
    };

    startRipple = (event: PressEvent) => {
        const { width, height } = this.state;
        const { duration, centered, size, onRippleAnimation } = this.props;

        const w2 = 0.5 * width;
        const h2 = 0.5 * height;

        const { locationX, locationY } = centered
            ? { locationX: w2, locationY: h2 }
            : event.nativeEvent;

        const offsetX = Math.abs(w2 - locationX);
        const offsetY = Math.abs(h2 - locationY);

        // $FlowFixMe
        const R = size > 0 ? 0.5 * size : Math.sqrt(Math.pow(w2 + offsetX, 2) + Math.pow(h2 + offsetY, 2));

        const ripple = {
            unique: this.unique++,
            progress: new Animated.Value(0),
            locationX,
            locationY,
            R
        };

        const animation = Animated.timing(ripple.progress, {
            toValue: 1,
            easing: Easing.out(Easing.ease),
            duration,
            useNativeDriver: true
        });

        // $FlowFixMe
        onRippleAnimation(animation, this.onAnimationEnd);

        this.setState(({ ripples }) => ({ ripples: ripples.concat(ripple) }));
    };

    renderRipple = ({ unique, progress, locationX, locationY, R }: Ripple) => {
        const { color, opacity, fades, theme } = this.props;

        const rippleStyle = {
            top: locationY - radius,
            left: locationX - radius,
            backgroundColor: color || theme.variant === 'dark' ? Colors.white[1000] : Colors.black[1000],

            transform: [
                {
                    scale: progress.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.5 / radius, R / radius]
                    })
                }
            ],

            opacity: fades
                ? progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [opacity, 0]
                  })
                : opacity
        };

        return (
            <Animated.View style={[styles.ripple, rippleStyle]} key={unique} />
        );
    };

    render() {
        const { ripples } = this.state;
        const { onPress, onPressIn, onPressOut, onLongPress, onLayout } = this;
        const {
            delayLongPress,
            delayPressIn,
            delayPressOut,
            disabled,
            hitSlop,
            pressRetentionOffset,
            children,
            containerBorderRadius,
            testID,
            nativeID,
            accessible,
            accessibilityLabel,
            onLayout: __ignored__,
            // $FlowFixMe
            style,
            ...props
        } = this.props;

        const touchableProps = {
            delayLongPress,
            delayPressIn,
            delayPressOut,
            disabled,
            hitSlop,
            pressRetentionOffset,
            onPress,
            onPressIn,
            testID,
            nativeID,
            accessible,
            accessibilityLabel,
            onPressOut,
            onLongPress: props.onLongPress ? onLongPress : undefined,
            onLayout
        };

        const containerStyle = {
            borderRadius: containerBorderRadius
        };

        const styleView = {
            ...style,
            opacity: 1
        };

        return (
            <TouchableWithoutFeedback {...touchableProps}>
                <Animated.View {...props} {...styleView} pointerEvents="box-only">
                    {children}
                    <View style={[styles.container, containerStyle]}>
                        {ripples.map(this.renderRipple)}
                    </View>
                </Animated.View>
            </TouchableWithoutFeedback>
        );
    }
}

RippleEffect.propTypes = {
    ...Animated.View.propTypes,
    // $FlowFixMe
    ...TouchableWithoutFeedback.propTypes,
    color: PropTypes.string,
    opacity: PropTypes.number,
    duration: PropTypes.number,
    size: PropTypes.number,
    containerBorderRadius: PropTypes.number,
    centered: PropTypes.bool,
    sequential: PropTypes.bool,
    fades: PropTypes.bool,
    disabled: PropTypes.bool,
    onRippleAnimation: PropTypes.func
};

export default withTheme(RippleEffect);
