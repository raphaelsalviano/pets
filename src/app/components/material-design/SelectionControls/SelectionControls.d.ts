/* @flow */

import * as React from 'react';

export interface SelectionControlsProps {
    variant: 'radio' | 'check' | 'switch',
    checked: boolean,
    color: string,
    disabled?: boolean,
    onChange?: Function,
    label?: string,
    labelDirection?: 'start' | 'end',
}

declare const SelectionControls: React.ComponentType<SelectionControlsProps>;

export default SelectionControls;