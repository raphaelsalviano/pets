/* @flow */

import * as React from 'react';

export interface FloatingActionButtonItemProps {
    id: string,
    active: boolean,
    position: 'left' | 'right' | 'center',
    iconName?: string,
    iconColor?: string,
    imgResource?: number,
    actionColor?: string,
    labelTooltip?: string,
    colorLabelTooltip?: string,
    colorTooltip?: string,
    onPress: Function
}

declare const FloatingActionButtonItem: React.ComponentType<FloatingActionButtonItemProps>;

export default FloatingActionButtonItem;