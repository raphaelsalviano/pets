/* @flow */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import {
    View,
    Animated,
    Easing,
    StyleSheet,
    ActivityIndicator,
    Platform
} from 'react-native';

import { withTheme } from '../styles';

import Indicator from './Indicator';

import type { ThemeDefault } from '../types/ThemeType';

type Props = {
    +color?: ?string,
    /**
     * @optional
     */
    theme: ThemeDefault
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    layer: {
        ...StyleSheet.absoluteFillObject,
        alignItems: 'center',
        justifyContent: 'center'
    }
});

const size = 24;
const animationDuration = 2400;

class CircularProgressBar extends PureComponent<Props> {
    static defaultProps = {
        color: null
    };

    // eslint-disable-next-line no-unused-vars
    renderComponent = ({ index, count, progress }) => {
        const { color, theme } = this.props;

        const frames = (60 * animationDuration) / 1000;
        const easing = Easing.bezier(0.4, 0.0, 0.7, 1.0);

        const inputRange = Array.from(
            new Array(frames),
            (value, frameIndex) => frameIndex / (frames - 1)
        );

        const outputRange = Array.from(
            new Array(frames),
            (value, frameIndex) => {
                // eslint-disable-next-line no-shadow
                let progress = (2 * frameIndex) / (frames - 1);
                const rotation = index ? +(360 - 15) : -(180 - 15);

                if (progress > 1.0) {
                    progress = 2.0 - progress;
                }

                const direction = index ? -1 : +1;

                // eslint-disable-next-line prettier/prettier
                return `${direction * (180 - 30) * easing(progress) + rotation}deg`;
            }
        );

        const layerStyle = {
            width: size,
            height: size,
            transform: [
                {
                    rotate: progress.interpolate({
                        inputRange: [0, 1],
                        outputRange: [
                            `${0 + 30 + 15}deg`,
                            `${2 * 360 + 30 + 15}deg`
                        ]
                    })
                }
            ]
        };

        const viewportStyle = {
            width: size,
            height: size,
            transform: [
                {
                    translateY: index ? -size / 2 : 0
                },
                {
                    rotate: progress.interpolate({ inputRange, outputRange })
                }
            ]
        };

        const containerStyle = {
            width: size,
            height: size / 2,
            overflow: 'hidden'
        };

        const offsetStyle = index ? { top: size / 2 } : null;

        const lineStyle = {
            width: size,
            height: size,
            borderColor: color || theme.palette.colorAccent,
            borderWidth: size / 10,
            borderRadius: size / 2
        };

        const animatedOneProps = {
            style: [containerStyle, offsetStyle],
            collapsable: false
        };

        const animatedTwoProps = {
            style: containerStyle,
            collapsable: false
        };

        return (
            <Animated.View style={styles.layer} {...{ key: index }}>
                <Animated.View style={layerStyle}>
                    <Animated.View {...animatedOneProps}>
                        <Animated.View style={viewportStyle}>
                            <Animated.View {...animatedTwoProps}>
                                <Animated.View style={lineStyle} />
                            </Animated.View>
                        </Animated.View>
                    </Animated.View>
                </Animated.View>
            </Animated.View>
        );
    };

    render() {
        const { color, theme } = this.props;

        if (Platform.OS === 'android') {
            const activityIndicator = {
                size: 'small',
                color: color || theme.palette.colorAccent
            };

            return <ActivityIndicator {...activityIndicator} />;
        }

        const indicatorProps = {
            count: 2,
            renderComponent: this.renderComponent,
            style: { width: size, height: size }
        };

        return (
            <View style={styles.container}>
                <Indicator {...indicatorProps} />
            </View>
        );
    }
}

CircularProgressBar.propTypes = {
    color: PropTypes.string
};

export default withTheme(CircularProgressBar);
