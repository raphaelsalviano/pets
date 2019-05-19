/* eslint-disable operator-linebreak */
/* @flow */

import {
    Platform,
    Dimensions,
    PixelRatio,
    BackHandler,
    // eslint-disable-next-line react-native/split-platform-components
    BackAndroid as DeprecatedBackAndroid
} from 'react-native';

export const BackAndroid = BackHandler || DeprecatedBackAndroid;

export function isIphoneX(): boolean {
    const windowSize = Dimensions.get('window');

    const iPhoneX = windowSize.height === 812 || windowSize.width === 812;
    const iPhoneXR = windowSize.height === 896 || windowSize.width === 896;

    return (
        Platform.OS === 'ios' &&
        !Platform.isTVOS &&
        !Platform.isTVOS &&
        (iPhoneX || iPhoneXR)
    );
}

export function getDimensions(dimen: 'height' | 'width' | null = null): number {
    const windowSize = Dimensions.get('window');

    if (!dimen) {
        return 0;
    }

    return windowSize[dimen];
}

export function getBackButtonListener(callback: Function) {
    BackAndroid.addEventListener('hardwareBackPress', callback);
}

export function isTablet(): boolean {
    const pixelDensity = PixelRatio.get();
    const adjustedWidth = getDimensions('width') * pixelDensity;
    const adjustedHeight = getDimensions('height') * pixelDensity;

    if (
        getDimensions('width') >= 600 &&
        pixelDensity < 2 &&
        (adjustedWidth >= 1000 || adjustedHeight >= 1000)
    ) {
        return true;
    }
    if (
        getDimensions('width') >= 600 &&
        pixelDensity === 2 &&
        (adjustedWidth >= 1920 || adjustedHeight >= 1920)
    ) {
        return true;
    }

    return false;
}
