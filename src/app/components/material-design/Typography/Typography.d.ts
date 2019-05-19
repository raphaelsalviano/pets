/* @flow */

import * as React from 'react';

import { TypographyStyle } from '../types/ThemeType';

export interface TypographyProps {
    variant:
        | 'h1'
        | 'h2'
        | 'h3'
        | 'h4'
        | 'h5'
        | 'h6'
        | 'subtitle1'
        | 'subtitle2'
        | 'body1'
        | 'body2'
        | 'button'
        | 'caption'
        | 'overline',
    color?: 'default' | 'error' | 'primary' | 'secondary' | 'tertiary',
    gutterBottom?: boolean,
    truncate?: boolean,
    numberOfLines?: number,
    styles?: TypographyStyle
}

declare const Typography: React.ComponentType<TypographyProps>;

export default Typography;