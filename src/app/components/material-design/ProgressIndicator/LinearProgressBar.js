/* @flow */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { View, Animated, Easing, StyleSheet } from 'react-native';

import Color from 'color';

import { withTheme } from '../styles';

import type { ThemeDefault } from '../types/ThemeType';

type Props = {
    +animated?: boolean,
    +color?: ?string,
    +indeterminate?: boolean,
    +progress?: number,
    /**
     * @optional
     */
    theme: ThemeDefault,
    +children?: any
};

type State = {
    +width: number,
    +progressAnimation: Animated.Value,
    +animationValue: Animated.Value
};

const styles = StyleSheet.create({
    root: {
        width: '100%',
        height: 4
    }
});

const INDETERMINATE_WIDTH_FACTOR = 0.3;
// eslint-disable-next-line prettier/prettier
const BAR_WIDTH_ZERO_POSITION = INDETERMINATE_WIDTH_FACTOR / (1 + INDETERMINATE_WIDTH_FACTOR);

class LinearProgressBar extends PureComponent<Props, State> {
    static defaultProps = {
        animated: true,
        color: null,
        indeterminate: true,
        progress: 0,
        children: null
    };

    constructor(props: Props) {
        super(props);

        // $FlowFixMe
        const progress = Math.min((Math.max(props.progress, 0), 1));

        this.state = {
            width: 0,
            progressAnimation: new Animated.Value(
                props.indeterminate ? INDETERMINATE_WIDTH_FACTOR : progress
            ),
            animationValue: new Animated.Value(BAR_WIDTH_ZERO_POSITION)
        };
    }

    componentDidMount() {
        const { indeterminate } = this.props;

        if (indeterminate) {
            this.animate();
        }
    }

    componentDidUpdate(prevProps: Props) {
        const { indeterminate, progress, animated } = this.props;
        const { animationValue, progressAnimation } = this.state;

        if (indeterminate !== prevProps.indeterminate) {
            if (indeterminate) {
                this.animate();
            } else {
                Animated.spring(animationValue, {
                    toValue: BAR_WIDTH_ZERO_POSITION,
                    useNativeDriver: true
                }).start();
            }
        }

        // eslint-disable-next-line prettier/prettier
        if (indeterminate !== prevProps.indeterminate || progress !== prevProps.progress) {
            const progressTemp = indeterminate
                ? INDETERMINATE_WIDTH_FACTOR // $FlowFixMe
                : Math.min(Math.max(progress, 0), 1);

            if (animated) {
                Animated.spring(progressAnimation, {
                    toValue: progressTemp,
                    useNativeDriver: true,
                    bounciness: 0
                }).start();
            } else {
                // $FlowFixMe
                progressAnimation.setValue(progress);
            }
        }
    }

    animate = () => {
        const { animationValue } = this.state;

        animationValue.setValue(0);

        Animated.timing(animationValue, {
            toValue: 1,
            duration: 1000,
            easing: Easing.linear,
            isInteraction: false,
            useNativeDriver: true
        }).start((endState) => {
            if (endState.finished) {
                this.animate();
            }
        });
    };

    handleLayout = (event: any) => {
        this.setState({
            width: event.nativeEvent.layout.width
        });
    };

    render() {
        const { color, theme, children } = this.props;
        const { width, animationValue, progressAnimation } = this.state;

        const innerWidth = Math.max(0, width);

        const containerStyle = [
            styles.root,
            {
                overflow: 'hidden',
                backgroundColor: Color(color || theme.palette.colorAccent)
                    .alpha(0.6)
                    .toString()
            }
        ];

        const progressStyle = {
            backgroundColor: color || theme.palette.colorAccent,
            height: 4,
            transform: [
                {
                    translateX: animationValue.interpolate({
                        inputRange: [0, 1],
                        outputRange: [
                            innerWidth * -INDETERMINATE_WIDTH_FACTOR,
                            innerWidth
                        ]
                    })
                },
                {
                    translateX: progressAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [innerWidth / -2, 0]
                    })
                },
                {
                    scaleX: progressAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.0001, 1]
                    })
                }
            ]
        };

        return (
            <View style={containerStyle} onLayout={this.handleLayout}>
                <Animated.View style={progressStyle} />
                {children}
            </View>
        );
    }
}

LinearProgressBar.propTypes = {
    animated: PropTypes.bool,
    color: PropTypes.string,
    indeterminate: PropTypes.bool,
    progress: PropTypes.number,
    children: PropTypes.node
};

export default withTheme(LinearProgressBar);
