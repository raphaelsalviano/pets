/* @flow */

import * as React from 'react';

export interface IconProps {
    size?: number,
    name: string,
    color?: string,
}

declare const Icon: React.ComponentType<IconProps>;

export default Icon;