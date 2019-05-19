/* @flow */

import * as React from 'react';

export interface MenuItemProps {
    disabled?: boolean,
    onPress?: Function,
}

declare const MenuItem: React.ComponentType<MenuItemProps>;

export default MenuItem;