/* eslint-disable no-nested-ternary */
/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
/* eslint-disable react/no-unused-state */
/* @flow */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import {
    Animated,
    Dimensions,
    Easing,
    Modal,
    Platform,
    StyleSheet,
    View,
    ViewPropTypes,
    TouchableWithoutFeedback
} from 'react-native';

import { withTheme } from '../styles';
import * as Colors from '../colors';
import MenuItem from './MenuItem';

import { isEmpty } from '../util';

import type { ThemeDefault } from '../types/ThemeType';
import type { LayoutEvent } from '../types/CoreEvents';

type MenuItemType = {
    +label: string,
    +disabled?: boolean,
    +onPress: Function
};

type Props = {
    +buttonComponent: any,
    +menuItems: Array<MenuItemType>,
    +onClose?: Function,
    +style?: any,
    /**
     * @optional
     */
    +theme: ThemeDefault
};

type State = {
    menuState: string,
    top: number,
    left: number,
    menuWidth: number,
    menuHeight: number,
    buttonWidth: number,
    buttonHeight: number,
    menuSizeAnimation: Animated.ValueXY,
    opacityAnimation: Animated.Value
};

const styles = StyleSheet.create({
    shadowMenuContainer: {
        position: 'absolute',
        borderRadius: 4,
        opacity: 0,
        ...Platform.select({
            ios: {
                shadowColor: Colors.black[1000],
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 2
            },
            android: {
                elevation: 8
            }
        })
    },
    menuContainer: {
        overflow: 'hidden'
    }
});

const STATES = {
    HIDDEN: 'HIDDEN',
    ANIMATING: 'ANIMATING',
    SHOWN: 'SHOWN'
};

const ANIMATION_DURATION = 300;
const EASING = Easing.bezier(0.4, 0, 0.2, 1);
const SCREEN_INDENT = 8;

class Menu extends PureComponent<Props, State> {
    static defaultProps = {
        onClose: null,
        style: null
    };

    container: any | null;

    constructor(props: Props) {
        super(props);

        this.state = {
            menuState: STATES.HIDDEN,
            top: 0,
            left: 0,
            menuWidth: 0,
            menuHeight: 0,
            buttonWidth: 0,
            buttonHeight: 0,
            menuSizeAnimation: new Animated.ValueXY({ x: 0, y: 0 }),
            opacityAnimation: new Animated.Value(0)
        };
    }

    setContainerRef = (ref: any | null) => {
        this.container = ref;
    };

    /**
     * Inicia a animação do menu
     */
    onMenuLayout = (event: LayoutEvent) => {
        const { menuState, menuSizeAnimation, opacityAnimation } = this.state;

        if (menuState === STATES.ANIMATING) {
            return null;
        }

        const { width, height } = event.nativeEvent.layout;

        this.setState(
            {
                menuState: STATES.ANIMATING,
                menuWidth: width,
                menuHeight: height
            },
            () => {
                Animated.parallel([
                    Animated.timing(menuSizeAnimation, {
                        toValue: { x: width, y: height },
                        duration: ANIMATION_DURATION,
                        easing: EASING
                    }),
                    Animated.timing(opacityAnimation, {
                        toValue: 1,
                        duration: ANIMATION_DURATION,
                        easing: EASING
                    })
                ]).start();
            }
        );

        return null;
    };

    // Salva as dimensões do botão
    onButtonLayout = (event: any) => {
        const { width, height } = event.nativeEvent.layout;
        this.setState({ buttonWidth: width, buttonHeight: height });
    };

    onClose = () => {
        const { onClose } = this.props;

        if (onClose) {
            onClose();
        }
    };

    show = () => {
        // $FlowFixMe
        this.container.measureInWindow((x: number, y: number) => {
            const top = Math.max((SCREEN_INDENT, y));
            const left = Math.max(SCREEN_INDENT, x);
            this.setState({ menuState: STATES.SHOWN, top, left });
        });
    };

    hide = () => {
        const { opacityAnimation } = this.state;

        Animated.timing(opacityAnimation, {
            toValue: 0,
            duration: ANIMATION_DURATION,
            easing: EASING
        }).start(() => {
            // Reinicia o state
            this.setState(
                {
                    menuState: STATES.HIDDEN,
                    menuSizeAnimation: new Animated.ValueXY({ x: 0, y: 0 }),
                    opacityAnimation: new Animated.Value(0)
                },
                () => {
                    this.onClose();
                }
            );
        });
    };

    renderItems = (menuItems: Array<MenuItemType>) => {
        if (isEmpty(menuItems)) {
            return null;
        }

        return (
            <React.Fragment>
                {menuItems.map((item, index) => {
                    const menuItemProps = {
                        key: index,
                        ...(item && item.disabled ? { disabled: item.disabled } : null),
                        onPress: () => {
                            if (item.onPress) {
                                item.onPress();
                            }

                            this.hide();
                        }
                    };

                    return <MenuItem {...menuItemProps}>{item.label}</MenuItem>;
                })}
            </React.Fragment>
        );
    };

    render() {
        const { buttonComponent, menuItems, style, theme } = this.props;
        const {
            menuSizeAnimation,
            menuWidth,
            menuHeight,
            buttonWidth,
            buttonHeight,
            opacityAnimation,
            menuState
        } = this.state;

        const dimensions = Dimensions.get('screen');

        const menuSize = {
            width: menuSizeAnimation.x,
            height: menuSizeAnimation.y
        };

        // Ajusta a opsição do menu
        let { left, top } = this.state;
        const transforms = [];

        // Virar pelo eixo X se o menu atingir a borda direita da tela
        if (left > dimensions.width - menuWidth - SCREEN_INDENT) {
            transforms.push({
                translateX: Animated.multiply(menuSizeAnimation.x, -1)
            });

            left = Math.min(
                dimensions.width - SCREEN_INDENT,
                left + buttonWidth
            );
        }

        // Virar pelo eixo Y se o menu atingir a borda inferior da tela
        if (top > dimensions.height - menuHeight - SCREEN_INDENT) {
            transforms.push({
                translateY: Animated.multiply(menuSizeAnimation.y, -1)
            });

            top = Math.min(
                dimensions.height - SCREEN_INDENT,
                top + buttonHeight
            );
        }

        const shadowMenuContainerStyle = {
            opacity: opacityAnimation,
            transform: transforms,
            left,
            top
        };

        const animationStarted = menuState === STATES.ANIMATING;
        const modalVisible = menuState === STATES.SHOWN || animationStarted;

        const modalProps = {
            visible: modalVisible,
            onRequestClose: this.hide,
            supportedOrientations: [
                'portrait',
                'portrait-upside-down',
                'landscape',
                'landscape-left',
                'landscape-right'
            ],
            transparent: true
        };

        const viewRootProps = {
            onLayout: this.onMenuLayout,
            style: [
                styles.shadowMenuContainer,
                shadowMenuContainerStyle,
                style,
                {
                    backgroundColor:
                        theme.variant === 'dark'
                            ? Colors.grey[800]
                            : Colors.white[1000],
                    ...Platform.select({
                        android: {
                            borderColor:
                                Platform.Version < 20
                                    ? theme.variant === 'dark'
                                        ? 'rgba(255, 255, 255, .12)'
                                        : 'rgba(0, 0, 0, .25)'
                                    : 'transparent',
                                borderWidth: Platform.Version < 20 ? 1 : 0
                        }
                    })
                }
            ]
        };

        const viewContentProps = {
            style: [styles.menuContainer, animationStarted && menuSize]
        };

        return (
            <View ref={this.setContainerRef} collapsable={false}>
                <View onLayout={this.onButtonLayout}>{buttonComponent}</View>

                <Modal {...modalProps}>
                    <TouchableWithoutFeedback onPress={this.hide}>
                        <View style={StyleSheet.absoluteFill}>
                            <Animated.View {...viewRootProps}>
                                <Animated.View {...viewContentProps}>
                                    {this.renderItems(menuItems)}
                                </Animated.View>
                            </Animated.View>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>
            </View>
        );
    }
}

Menu.propTypes = {
    buttonComponent: PropTypes.any.isRequired,
    menuItems: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string,
            disabled: PropTypes.bool,
            onPress: PropTypes.func
        })
    ).isRequired,
    onClose: PropTypes.func,
    style: ViewPropTypes.style
};

export default withTheme(Menu);
