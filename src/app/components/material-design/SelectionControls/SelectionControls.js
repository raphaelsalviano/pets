/* @flow */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { StyleSheet, View, Switch, Platform } from 'react-native';

import Color from 'color';

import { withTheme } from '../styles';
import * as Colors from '../colors';
import Ripple from '../RippleEffect';
import Icon from '../Icon';
import Typography from '../Typography';

import type { ThemeDefault } from '../types/ThemeType';

type Props = {
    +variant: 'radio' | 'check' | 'switch',
    +checked: boolean,
    +color?: ?string,
    +disabled?: boolean,
    +onChange?: (checked: boolean) => mixed,
    +label?: ?string,
    +labelDirection?: 'start' | 'end',
    +theme: ThemeDefault
};

type State = {
    +checked: boolean
};

const styles = StyleSheet.create({
    root: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    }
});

class SelectionControls extends PureComponent<Props, State> {
    static defaultProps = {
        color: null,
        disabled: false,
        onChange: () => null,
        label: null,
        labelDirection: 'start'
    };

    static getDerivedStateFromProps(props: Props, state: State) {
        if (props.checked !== state.checked) {
            return {
                checked: props.checked
            };
        }

        return null;
    }

    constructor(props: Props) {
        super(props);

        this.state = {
            checked: props.checked || false
        };
    }

    onChange = () => {
        const { onChange } = this.props;

        if (onChange) {
            // eslint-disable-next-line react/destructuring-assignment
            onChange(!this.state.checked);
        }

        this.setState((prevState: State) => ({
            checked: !prevState.checked
        }));
    };

    render() {
        const {
            variant,
            color,
            disabled,
            label,
            labelDirection,
            theme
        } = this.props;
        const { checked } = this.state;

        let labelComponent = null;

        if (label) {
            const typographyProps = {
                variant: 'body2',
                gutterBottom: false,
                styles: { width: variant === 'switch' ? '75%' : '87%' }
            };

            labelComponent = (
                <Typography {...typographyProps}>{label}</Typography>
            );
        }

        let variantComponent = null;
        let iconProps = {};

        if (variant === 'radio') {
            iconProps = {
                name: checked
                    ? 'radio-button-checked'
                    : 'radio-button-unchecked',
                color: checked
                    ? color || theme.palette.colorAccent
                    : theme.palette.textColorPrimary,
                size: 20
            };

            if (disabled) {
                iconProps.color = theme.palette.textColorTertiary;
            }

            variantComponent = <Icon {...iconProps} />;
        }

        if (variant === 'check') {
            iconProps = {
                name: checked ? 'check-box' : 'check-box-blank',
                color: checked
                    ? color || theme.palette.colorAccent
                    : theme.palette.textColorPrimary,
                size: 24
            };

            if (disabled) {
                iconProps.color = theme.palette.textColorTertiary;
            }

            variantComponent = <Icon {...iconProps} />;
        }

        if (variant === 'switch') {
            const switchProps = {
                value: checked,
                ...Platform.select({
                    ios: {
                        trackColor: {
                            false: 'transparent',
                            true: 'transparent'
                        }
                    }
                }),
                ios_backgroundColor: checked
                    ? Color(color || theme.palette.colorAccent)
                          .alpha(0.56)
                          .toString()
                    : Colors.grey[500],
                thumbColor: checked
                    ? color || theme.palette.colorAccent
                    : Colors.white[1000],
                onValueChange: this.onChange,
                disabled
            };

            variantComponent = <Switch {...switchProps} />;
        }

        const styleWithLabel = {
            width: '100%',
            paddingVertical: 12
        };

        const styleWithoutLabel = {
            padding: 12,
            borderRadius: 16,
            justifyContent: 'center'
        };

        const containerStyle = {
            style: [
                styles.root,
                {
                    ...(label ? styleWithLabel : styleWithoutLabel),
                    height: 48
                }
            ]
        };

        const rippleProps = {
            containerBorderRadius: label ? 4 : 16,
            color: color || theme.palette.colorAccent,
            onPress: this.onChange,
            ...(disabled ? { disabled } : null),
            style: {
                width: label ? '100%' : 48,
                height: 48
            }
        };

        return (
            <Ripple {...rippleProps}>
                <View {...containerStyle}>
                    {labelDirection === 'start' ? labelComponent : null}
                    {variantComponent}
                    {labelDirection === 'end' ? labelComponent : null}
                </View>
            </Ripple>
        );
    }
}

SelectionControls.propTypes = {
    variant: PropTypes.oneOf(['radio', 'check', 'switch']).isRequired,
    checked: PropTypes.bool.isRequired,
    color: PropTypes.string,
    disabled: PropTypes.bool,
    onChange: PropTypes.func,
    label: PropTypes.string,
    labelDirection: PropTypes.oneOf(['start', 'end'])
};

export default withTheme(SelectionControls);
