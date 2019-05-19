/* @flow */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { Platform, Animated, Easing, View } from 'react-native';

import Color from 'color';

import { withTheme } from '../styles';
import * as Colors from '../colors';
import Icon from '../Icon';
import Ripple from '../RippleEffect';
import Typography from '../Typography';

import type { ThemeDefault } from '../types/ThemeType';

import type { StylePropTypes } from '../types/StylesTypes';

type Props = {
    +radius: number,
    +color?: ?string,
    +textColor?: ?string,
    +disabled?: boolean,
    +fullWidth?: boolean,
    +variant: 'text' | 'outlined' | 'contained',
    +rippleColor?: ?string,
    +iconName?: ?string,
    +iconColor?: ?string,
    +onLongPress?: ?Function,
    +onPress?: ?Function,
    +style?: ?StylePropTypes,
    /**
     * @optional
     */
    theme: ThemeDefault,
    +children: string
};

type State = {
    focusAnimation: any,
    focus: boolean
};

const styles = {
    root: {
        minWidth: 64,
        height: 36,
        borderRadius: 4
    },
    content: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    }
};

class Button extends PureComponent<Props, State> {
    static defaultProps = {
        radius: 4,
        color: null,
        textColor: null,
        disabled: false,
        fullWidth: false,
        variant: 'text',
        rippleColor: null,
        iconName: null,
        iconColor: null,
        onLongPress: null,
        onPress: null,
        style: null
    };

    constructor(props) {
        super(props);

        this.state = {
            focusAnimation: new Animated.Value(0),
            focus: false
        };
    }

    onPress = () => {
        const { onPress } = this.props;

        if (onPress) {
            onPress();
        }
    };

    onLongPress = () => {
        const { onLongPress } = this.props;

        if (onLongPress) {
            onLongPress();
        }
    };

    onPressIn = () => {
        const { focusAnimation, focus } = this.state;

        this.setState({ focus: !focus });

        Animated.timing(focusAnimation, {
            toValue: 1,
            duration: 325,
            easing: Easing.out(Easing.ease)
        }).start();
    };

    onPressOut = () => {
        const { focusAnimation, focus } = this.state;

        this.setState({ focus: !focus });

        Animated.timing(focusAnimation, {
            toValue: 0,
            duration: 325,
            easing: Easing.out(Easing.ease)
        }).start();
    };

    render() {
        const {
            color,
            textColor,
            disabled,
            fullWidth,
            variant,
            rippleColor,
            iconName,
            iconColor,
            style,
            theme,
            radius,
            children
        } = this.props;

        const { focusAnimation, focus } = this.state;

        const offSet = focusAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: [2, 8]
        });

        const iconProps = {
            name: iconName,
            color: disabled
                ? theme.palette.textColorTertiary
                : iconColor || theme.palette.colorAccent
        };

        const rippleProps = {
            ...(variant === 'outlined'
                ? {
                      color: color || (rippleColor || theme.palette.colorAccent)
                  }
                : null),
            ...(variant === 'text'
                ? {
                      color: color || (rippleColor || theme.palette.colorAccent)
                  }
                : null),
            containerBorderRadius: radius,
            disabled,
            onPress: disabled ? null : this.onPress,
            onLongPress: disabled ? null : this.onLongPress,
            onPressIn: variant === 'contained' ? this.onPressIn : null,
            onPressOut: variant === 'contained' ? this.onPressOut : null
        };

        if (variant === 'text') {
            const stylesTypographyButton = {
                color: disabled
                    ? theme.palette.textColorTertiary
                    : color || textColor || theme.palette.colorAccent,
                ...(iconName ? { marginLeft: 8 } : null)
            };

            const stylesTextButton = {
                ...styles.root,
                ...style,
                ...(fullWidth ? { flex: 1 } : null),
                ...(iconName ? null : { paddingHorizontal: 8 }),
                ...(iconName ? { paddingLeft: 12, paddingRight: 16 } : null)
            };

            const typographyProps = {
                variant: 'button',
                gutterBottom: false,
                styles: stylesTypographyButton
            };

            return (
                <Ripple style={stylesTextButton} {...rippleProps}>
                    <View style={styles.content}>
                        {iconName ? <Icon {...iconProps} /> : null}
                        <Typography {...typographyProps}>{children}</Typography>
                    </View>
                </Ripple>
            );
        }

        if (variant === 'outlined') {
            const stylesTypographyOutlined = {
                color: disabled
                    ? theme.palette.textColorTertiary
                    : color || textColor || theme.palette.colorAccent,
                ...(iconName ? { marginLeft: 8 } : null)
            };

            const stylesTextButton = {
                ...styles.root,
                ...style,
                borderWidth: 1,
                borderColor: disabled
                    ? theme.palette.textColorTertiary
                    : Color(Colors.black[1000])
                          .alpha(0.12)
                          .toString(),
                paddingVertical: 16,
                ...(fullWidth ? { flex: 1 } : null),
                ...(iconName ? { paddingLeft: 12, paddingRight: 16 } : null)
            };

            const typographyProps = {
                variant: 'button',
                gutterBottom: false,
                styles: stylesTypographyOutlined
            };

            return (
                <Ripple style={stylesTextButton} {...rippleProps}>
                    <View style={styles.content}>
                        {iconName ? <Icon {...iconProps} /> : null}
                        <Typography {...typographyProps}>{children}</Typography>
                    </View>
                </Ripple>
            );
        }

        const stylesTypographyContained = {
            color: disabled
                ? theme.palette.textColorSecondary
                : Colors.white[1000] || textColor,
            ...(iconName ? { marginLeft: 8 } : null)
        };

        iconProps.color = disabled
            ? theme.palette.textColorTertiary
            : Colors.white[1000];

        const stylesContainedButton = {
            ...styles.root,
            ...style,
            borderRadius: radius,
            backgroundColor: disabled
                ? Color(
                      theme.variant === 'dark'
                          ? Colors.white[1000]
                          : Colors.black[1000]
                  )
                      .alpha(0.38)
                      .toString()
                : color || theme.palette.colorAccent,
            paddingHorizontal: 16,
            ...(fullWidth ? { flex: 1 } : null),
            ...(iconName ? { paddingLeft: 12, paddingRight: 16 } : null)
        };

        const typographyProps = {
            variant: 'button',
            gutterBottom: false,
            styles: stylesTypographyContained
        };

        const containerButtonStyle = [styles.content, { borderRadius: radius }];

        const styleAnimated = {
            borderRadius: radius,
            ...Platform.select({
                ios: {
                    shadowColor: Colors.black[1000],
                    shadowRadius: focus ? 4 : 2,
                    shadowOpacity: 0.24,
                    shadowOffset: {
                        width: 0,
                        height: offSet
                    }
                },
                android: {
                    elevation: focus ? 8 : 2
                }
            })
        };

        return (
            <Animated.View style={styleAnimated}>
                <Ripple style={stylesContainedButton} {...rippleProps}>
                    <View style={containerButtonStyle}>
                        {iconName ? <Icon {...iconProps} /> : null}
                        <Typography {...typographyProps}>{children}</Typography>
                    </View>
                </Ripple>
            </Animated.View>
        );
    }
}

Button.propTypes = {
    radius: PropTypes.number,
    color: PropTypes.string,
    textColor: PropTypes.string,
    disabled: PropTypes.bool,
    fullWidth: PropTypes.bool,
    variant: PropTypes.oneOf(['text', 'outlined', 'contained']),
    rippleColor: PropTypes.string,
    iconName: PropTypes.string,
    iconColor: PropTypes.string,
    onLongPress: PropTypes.func,
    onPress: PropTypes.func,
    style: PropTypes.object
};

export default withTheme(Button);
