/* eslint-disable consistent-return */
/* @flow */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { Animated, Easing } from 'react-native';

import RN from 'react-native/package';

type Props = {
    +animationEasing?: Function,
    +animationDuration?: number,
    +animating?: boolean,
    +interaction?: boolean,
    +renderComponent?: Function,
    +count?: number
};

type State = {
    progress: Animated.Value,
    animation: any
};

// eslint-disable-next-line arrow-parens
const [bigger, smaller] = RN.version.split('.').map((item) => Number(item));
const hasLoopSupport: boolean = !bigger && smaller >= 45;

class Indicator extends PureComponent<Props, State> {
    static defaultProps = {
        animationEasing: Easing.linear,
        animationDuration: 1200,
        renderComponent: null,
        animating: true,
        interaction: true,
        count: 1
    };

    mounted: boolean;

    constructor(props: Props) {
        super(props);

        this.state = {
            progress: new Animated.Value(0),
            animation: null
        };
    }

    componentDidMount() {
        const { animating } = this.props;

        this.mounted = true;

        if (animating) {
            this.startAnimation();
        }
    }

    componentDidUpdate(prevProps: Props) {
        const { animating } = this.props;

        // $FlowFixMe
        if (animating ^ prevProps.animating) {
            if (animating) {
                this.stopAnimation();
            } else {
                this.startAnimation();
            }
        }
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    // $FlowFixMe
    startAnimation = ({ finished } = {}) => {
        const { progress } = this.state;
        const { interaction, animationEasing, animationDuration } = this.props;

        if (!this.mounted || finished === false) {
            return null;
        }

        const animation = Animated.timing(progress, {
            duration: animationDuration,
            easing: animationEasing,
            useNativeDriver: true,
            isInteraction: interaction,
            toValue: 1
        });

        if (hasLoopSupport) {
            Animated.loop(animation).start();
        } else {
            progress.setValue(0);
            // $FlowFixMe
            animation.start(this.startAnimation);
        }

        this.setState({ animation });
    };

    stopAnimation = () => {
        const { animation } = this.state;

        if (animation === null) {
            return null;
        }

        animation.stop();

        this.setState({ animation: null });
    };

    renderComponent = (value: null, index: number) => {
        const { progress } = this.state;
        const { renderComponent, count } = this.props;

        if (typeof renderComponent === 'function') {
            return renderComponent({ index, count, progress });
        }

        return null;
    };

    render() {
        const { count, ...props } = this.props;

        return (
            <Animated.View {...props}>
                {// $FlowFixMe
                Array.from(new Array(count), this.renderComponent)}
            </Animated.View>
        );
    }
}

Indicator.propTypes = {
    animationEasing: PropTypes.func,
    animationDuration: PropTypes.number,
    animating: PropTypes.bool,
    interaction: PropTypes.bool,
    renderComponent: PropTypes.func,
    count: PropTypes.number
};

export default Indicator;
