/* @flow */

import * as React from 'react';

export interface ButtonProps {
    radius?: number,
    color?: string,
    textColor?: string,
    disabled?: boolean,
    fullWidth?: boolean,
    variant: 'text' | 'outlined' | 'contained',
    rippleColor?: string,
    iconName?: string,
    iconColor?: string,
    onLongPress?: Function,
    onPress?: Function
}

declare const Button: React.ComponentType<ButtonProps>;

export default Button;