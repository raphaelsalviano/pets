/* @flow */

import * as React from 'react';

export interface RippleEffectProps {
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
    color?: string,
    opacity?: number,
    duration?: number,
    size?: number,
    containerBorderRadius?: number,
    centered?: boolean,
    sequential?: boolean,
    fades?: boolean,
    disabled?: boolean,
    onRippleAnimation?: Function,
    children: any
}

declare const RippleEffect: React.ComponentType<RippleEffectProps>;

export default RippleEffect;