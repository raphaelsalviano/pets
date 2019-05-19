/* @flow */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Icon from '../Icon';
import Ripple from '../RippleEffect';

type Props = {
    +iconName: string,
    +iconColor?: ?string,
    +rippleColor?: string,
    +rippleContainerRadius?: ?number,
    +disabled?: boolean,
    +onPress: Function
};

class ToggleButton extends PureComponent<Props> {
    static defaultProps = {
        iconColor: null,
        rippleColor: '',
        rippleContainerRadius: 0,
        disabled: false
    };

    onPress = () => {
        const { onPress } = this.props;

        if (onPress) {
            onPress();
        }
    };

    render() {
        const {
            iconName,
            iconColor,
            rippleColor,
            rippleContainerRadius,
            disabled
        } = this.props;

        const rippleStyle = {
            padding: 8
        };

        const rippleProps = {
            ...(rippleColor ? { color: rippleColor } : null),
            containerBorderRadius: rippleContainerRadius || 42 / 2,
            disabled,
            onPress: () => this.onPress()
        };

        const iconProps = {
            name: iconName,
            color: iconColor
        };

        return (
            <Ripple style={rippleStyle} {...rippleProps}>
                <Icon {...iconProps} />
            </Ripple>
        );
    }
}

ToggleButton.propTypes = {
    iconName: PropTypes.string.isRequired,
    iconColor: PropTypes.string,
    rippleColor: PropTypes.string,
    rippleContainerRadius: PropTypes.number,
    disabled: PropTypes.bool,
    onPress: PropTypes.func.isRequired
};

export default ToggleButton;
