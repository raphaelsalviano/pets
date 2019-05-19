/* @flow */

import * as React from 'react';

import { ViewStylePropTypes } from '../types/StylesTypes';
import { DropdownItemType } from './DropdownItem';

export interface DropdownMenuProps {
    buttonComponent: any,
    menuItems: Array<DropdownItemType>,
    onClose?: (item: DropdownItemType | null) => Function,
    style?: ViewStylePropTypes,
}

declare const DropdownMenu: React.ComponentType<DropdownMenuProps>;

export default DropdownMenu;