/* @flow */

import * as React from 'react';

export interface AvatarProps {
    variant: 'image' | 'text' | 'icon',
    size?: number,
    backgroundColor?: string,
    imgProps?: {
        uri?: string,
        resource?: any
    },
    textProps?: {
        label: string,
        color: string,
        variant: string
    },
    iconProps?: {
        name: string,
        color: string,
        size: string
    }
}

declare const Avatar: React.ComponentType<AvatarProps>;

export default Avatar;