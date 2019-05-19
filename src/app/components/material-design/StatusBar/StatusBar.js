/* @flow */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import {
    StyleSheet,
    Animated,
    Platform,
    StatusBar as ReactStatusBar,
    Dimensions
} from 'react-native';

import { withTheme } from '../styles';
import * as Colors from '../colors';

import { isIphoneX, isTablet } from '../util/platform';

import type { ThemeDefault } from '../types/ThemeType';
import type { Layout } from '../types/CoreEvents';

type Props = {
    +hidden?: boolean,
    +color?: any,
    +colorIos?: any,
    +barStyle?: 'light-content' | 'dark-content',
    +theme: ThemeDefault
};

type State = {
    +orientation: 'portrait' | 'landscape'
};

const STATUSBAR = isIphoneX() ? 44 : 20;

const styles = StyleSheet.create({
    statusBar: {
        height: STATUSBAR,
        zIndex: 1000
    },
    shadow: {
        ...Platform.select({
            ios: {
                shadowColor: Colors.black[1000],
                shadowOpacity: 0.3,
                shadowRadius: 2,
                shadowOffset: {
                    height: 2,
                    width: 0
                },
                zIndex: 999
            },
            android: {
                elevation: Platform.Version >= 21 ? 4 : 0
            }
        })
    }
});

class StatusBar extends PureComponent<Props, State> {
    static defaultProps = {
        barStyle: 'light-content',
        hidden: false,
        color: null,
        colorIos: null
    };

    orientationListener: any;

    constructor(props: Props) {
        super(props);

        this.state = {
            orientation: 'portrait'
        };
    }

    componentDidMount() {
        this.orientationListener = Dimensions.addEventListener(
            'change',
            this.handlerOrientation
        );
    }

    componentWillUnmount = () => {
        if (this.orientationListener) {
            this.orientationListener.remove();
        }
    };

    handlerOrientation = ({ window }: { window: Layout }) => {
        if (window.width > window.height) {
            this.setState({ orientation: 'landscape' });
        } else {
            this.setState({ orientation: 'portrait' });
        }
    };

    render() {
        const { colorIos, color, hidden, theme, barStyle } = this.props;
        const { orientation } = this.state;

        // eslint-disable-next-line prettier/prettier
        let barStyleValue = theme.variant === 'dark' ? 'light-content' : 'dark-content';

        if (barStyle) {
            barStyleValue = barStyle;
        }

        const statusBarProps = {
            barStyle: barStyleValue,
            animated: true,
            translucent: false,
            backgroundColor: color || theme.palette.colorPrimaryDark
        };

        if (
            // eslint-disable-next-line operator-linebreak
            Platform.OS === 'ios' &&
            (orientation === 'portrait' || isTablet())
        ) {
            const styleProps = [
                styles.statusBar,
                hidden ? styles.shadow : null,
                { backgroundColor: colorIos }
            ];

            return (
                <Animated.View style={styleProps}>
                    <ReactStatusBar {...statusBarProps} />
                </Animated.View>
            );
        }

        return <ReactStatusBar {...statusBarProps} />;
    }
}

StatusBar.propTypes = {
    barStyle: PropTypes.oneOf(['light-content', 'dark-content']),
    hidden: PropTypes.bool,
    color: PropTypes.any,
    colorIos: PropTypes.any
};

export default withTheme(StatusBar);
