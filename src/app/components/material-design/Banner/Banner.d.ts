/* @flow */

import * as React from 'react';

export interface BannerActions {
    label: string,
    color?: string,
    onPress: Function
}

export interface BannerProps {
    visible: boolean,
    numberOfLines?: '1' | '2',
    message: string,
    actions: Array<BannerActions>,
    iconProps?: {
        nome: string,
        color: string,
        backgroundColor?: string
    }
}

declare const Banner: React.ComponentType<BannerProps>;

export default Banner;