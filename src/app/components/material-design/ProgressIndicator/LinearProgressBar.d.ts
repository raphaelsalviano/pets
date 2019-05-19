/* @flow */

import * as React from 'react';

export interface LinearProgressBarProps {
    animated?: boolean,
    color?: string,
    indeterminate?: boolean,
    progress?: number
}

declare const LinearProgressBar: React.ComponentType<LinearProgressBarProps>;

export default LinearProgressBar;