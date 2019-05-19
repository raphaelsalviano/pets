/* @flow */

import * as React from 'react';

export interface IndicatorProps {
    animationEasing?: Function,
    animationDuration?: number,
    animating?: boolean,
    interaction?: boolean,
    renderComponent?: Function,
    count?: number
}

declare const Indicator: React.ComponentType<IndicatorProps>;

export default Indicator;