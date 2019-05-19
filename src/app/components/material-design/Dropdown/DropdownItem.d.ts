/* @flow */

import * as React from 'react';

export interface DropdownItemType {
    label: string,
    value: string | number
}

export interface DropdownItemProps {
    item: DropdownItemType,
    disabled?: boolean,
    onSelected: (item: DropdownItemType) => Function
}

declare const DropdownItem: React.ComponentType<DropdownItemProps>;

export default DropdownItem;