/* @flow */

import * as React from 'react';

import { FloatingActionButtonItemProps } from './FloatingActionButtonItem';

export interface FloatingActionButtonProps {
   actions?: Array<FloatingActionButtonItemProps>,
   colorButton?: string,
   iconButton: string,
   iconColorButton?: string,
   visible?: boolean,
   overlayColor?: string,
   listenKeyboard?: boolean,
   position: 'right' | 'left' | 'center',
   dismissKeyboardOnPress?: Function,
   onPress: Function,
   onClose?: Function,
   onOpen?: Function,
}

declare const FloatingActionButtonItem: React.ComponentType<FloatingActionButtonProps>;

export default FloatingActionButtonItem;