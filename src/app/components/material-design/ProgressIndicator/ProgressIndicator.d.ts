/* @flow */

import * as React from 'react';

export interface ProgressIndicatorProps {
    variant?: 'linear' | 'circular',
    animated?: boolean,
    color?: string,
    indeterminate?: boolean,
    progress?: number
}

declare const ProgressIndicator: React.ComponentType<ProgressIndicatorProps>;

export default ProgressIndicator;