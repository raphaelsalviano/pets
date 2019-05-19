/* @flow */

import * as React from 'react';

export interface ToggleButtonProps {
    iconName: string,
    iconColor?: string,
    rippleColor?: string,
    rippleContainerRadius?: number | null,
    disabled?: boolean,
    onPress: Function
}

declare const ToggleButton: React.ComponentType<ToggleButtonProps>;

export default ToggleButton;