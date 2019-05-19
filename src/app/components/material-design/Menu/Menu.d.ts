/* @flow */

import * as React from 'react';

import { ViewStylePropTypes } from '../types/StylesTypes';

interface MenuItemType {
    label: string,
    disabled?: boolean,
    onPress: Function
}

export interface MenuProps {
    buttonComponent: any,
    menuItems: Array<MenuItemType>,
    onClose?: Function,
    style?: ViewStylePropTypes
}

declare const Menu: React.ComponentType<MenuProps>;

export default Menu;