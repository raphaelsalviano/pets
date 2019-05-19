/* @flow */

import * as React from 'react';

import { DropdownItemType } from './DropdownItem';

export interface DropdownProps {
    variant: 'filled' | 'outlined' | 'default',
    data: Array<DropdownItemType>,
    disabled?: boolean,
    label: string,
    error?: boolean,
    helperText?: string,
    value: string,
    onChangeValue: (value: DropdownItemType) => Function
}

declare const Dropdown: React.ComponentType<DropdownProps>;

export default Dropdown;