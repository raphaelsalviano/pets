/* @flow */

import * as React from 'react';

export interface BadgeProps {
    visible?: boolean,
    children?: string | number,
    size?: number,
    color?: string,
    style?: any
}

declare const Badge: React.ComponentType<BadgeProps>;

export default Badge;