/* @flow */

import * as React from 'react';

export interface SnackbarAction {
    label: string,
    color?: string,
    onPress: Function
}

export interface SnackbarProps {
    visible: boolean,
    numberOfLines: '1' | '2',
    message: string,
    action: SnackbarAction,
    onClose?: Function,
    distanceBotton: number
}

declare const Snackbar: React.ComponentType<SnackbarProps>;

export default Snackbar;