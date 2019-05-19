/* @flow */

import * as React from 'react';

export interface StatusBarProps {
    hidden?: boolean,
    color?: any,
    colorIos?: any,
    barStyle?: 'light-content' | 'dark-content',
}

declare const StatusBar: React.ComponentType<StatusBarProps>;

export default StatusBar;