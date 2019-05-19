/* eslint-disable react-native/no-unused-styles */
/* @flow */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import {
    StyleSheet,
    Animated,
    TouchableOpacity,
    LayoutAnimation,
    Platform,
    Keyboard,
    Dimensions
} from 'react-native';

import { withTheme } from '../styles';
import * as Colors from '../colors';
import Ripple from '../RippleEffect';
import Icon from '../Icon';

import FloatingActionButtonItem from './FloatingActionButtonItem';

import { isIphoneX, getDimensions } from '../util/platform';
import { isEmpty } from '../util';

import type { ThemeDefault } from '../types/ThemeType';
import type { ActionsProps } from './FloatingActionButtonItem';

type Props = {
    +actions?: ?Array<ActionsProps>,
    +colorButton?: ?string,
    +iconButton: string,
    +iconColorButton?: string,
    +visible?: boolean,
    +overlayColor?: ?string,
    +listenKeyboard?: boolean,
    +position: 'right' | 'left' | 'center',
    +dismissKeyboardOnPress?: Function,
    +onPress: Function,
    +onClose?: Function,
    +onOpen?: Function,
    +theme: ThemeDefault
};

type State = {
    +iconMain?: string,
    +active?: boolean,
    +orientation?: 'portrait' | 'landscape'
};

const FAB_SIZE = 56;

const KEYBOARD_EVENTS = {
    show: Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
    hide: Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide'
};

const styles = StyleSheet.create({
    fabContainer: {
        overflow: Platform.OS === 'ios' ? 'visible' : 'hidden',
        zIndex: 2,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        width: FAB_SIZE,
        height: FAB_SIZE,
        borderRadius: FAB_SIZE / 2,
        ...Platform.select({
            ios: {
                shadowColor: Colors.black[1000],
                shadowOpacity: 0.3,
                shadowRadius: 3,
                shadowOffset: {
                    height: 3,
                    width: 0
                }
            },
            android: {
                elevation: Platform.Version >= 21 ? 6 : 0
            }
        })
    },
    rippleFab: {
        width: FAB_SIZE,
        height: FAB_SIZE,
        borderRadius: FAB_SIZE / 2,
        flex: 1
    },
    contentRipple: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 16
    },
    actions: {
        position: 'absolute',
        zIndex: 10
    },
    rightActions: {
        alignItems: 'flex-end',
        right: -1000
    },
    leftActions: {
        alignItems: 'flex-start',
        left: -1000
    },
    centerActions: {
        left: -1000
    },
    rightActionsVisible: {
        right: 0
    },
    leftActionsVisible: {
        left: 0
    },
    centerActionsVisible: {
        left: getDimensions('width') / 2 - 16
    },
    overlay: {
        flex: 1,
        position: 'absolute',
        zIndex: 0,
        bottom: 0,
        left: 0,
        right: 0,
        top: 0
    }
});

class FloatingActionButton extends PureComponent<Props, State> {
    static defaultProps = {
        actions: null,
        colorButton: null,
        visible: true,
        overlayColor: null,
        listenKeyboard: false,
        dismissKeyboardOnPress: null,
        onClose: null,
        onOpen: null
    };

    keyboardWillShowListener: any;

    keyboardWillHideListener: any;

    mainBottomAnimation: Animated.Value;

    actionsBottomAnimation: Animated.Value;

    animation: Animated.Value;

    actionsAnimation: Animated.Value;

    visibleAnimation: Animated.Value;

    fadeAnimation: Animated.Value;

    orientationListener: any;

    constructor(props: Props) {
        super(props);

        this.mainBottomAnimation = new Animated.Value(isIphoneX() ? 34 : 16);
        this.actionsBottomAnimation = new Animated.Value(
            FAB_SIZE + (isIphoneX() ? 34 : 16)
        );
        this.animation = new Animated.Value(0);
        this.actionsAnimation = new Animated.Value(0);
        this.visibleAnimation = new Animated.Value(props.visible ? 0 : 1);
        this.fadeAnimation = new Animated.Value(props.visible ? 1 : 0);

        this.state = {
            iconMain: props.iconButton,
            active: false,
            orientation: 'portrait'
        };
    }

    componentDidMount() {
        const { listenKeyboard } = this.props;

        if (Platform.OS === 'ios') {
            if (listenKeyboard) {
                this.keyboardWillShowListener = Keyboard.addListener(
                    KEYBOARD_EVENTS.show,
                    this.onKeyboardShow
                );
                this.keyboardWillHideListener = Keyboard.addListener(
                    KEYBOARD_EVENTS.hide,
                    this.onKeyboardHide
                );
            }
        }

        this.orientationListener = Dimensions.addEventListener(
            'change',
            this.handlerOrientation
        );
    }

    componentDidUpdate(prevProps: Props) {
        const { visible } = this.props;

        if (visible !== prevProps.visible) {
            if (visible) {
                Animated.parallel([
                    Animated.spring(this.visibleAnimation, { toValue: 0 }),
                    Animated.spring(this.fadeAnimation, { toValue: 1 })
                ]).start();
            } else {
                Animated.parallel([
                    Animated.spring(this.visibleAnimation, { toValue: 0 }),
                    Animated.spring(this.fadeAnimation, { toValue: 1 })
                ]).start();
            }
        }
    }

    componentWillUnmount() {
        const { listenKeyboard } = this.props;

        if (this.orientationListener) {
            this.orientationListener.remove();
        }

        if (listenKeyboard) {
            if (this.keyboardWillShowListener) {
                this.keyboardWillShowListener.remove();
            }

            if (this.keyboardWillHideListener) {
                this.keyboardWillHideListener.remove();
            }
        }
    }

    handlerOrientation = ({ window }) => {
        if (window.width > window.height) {
            this.setState({ orientation: 'landscape' });
        } else {
            this.setState({ orientation: 'portrait' });
        }
    };

    onKeyboardShow = (event) => {
        const { height } = event.endCoordinates;

        Animated.parallel([
            Animated.spring(this.actionsBottomAnimation, {
                bounciness: 0,
                // eslint-disable-next-line prettier/prettier
                toValue: (FAB_SIZE + (isIphoneX() ? 34 : 16) + 8 + height) - (isIphoneX() ? 34 : 0),
                duration: 250
            }),
            Animated.spring(this.mainBottomAnimation, {
                bounciness: 0,
                // eslint-disable-next-line prettier/prettier
                toValue: ((isIphoneX() ? 34 : 16) + height) - (isIphoneX() ? 24 : 0),
                duration: 250
            })
        ]).start();
    };

    onKeyboardHide = () => {
        Animated.parallel([
            Animated.spring(this.actionsBottomAnimation, {
                bounciness: 0,
                toValue: FAB_SIZE + (isIphoneX() ? 34 : 16) + 8,
                duration: 250
            }),
            Animated.spring(this.mainBottomAnimation, {
                bounciness: 0,
                toValue: isIphoneX() ? 34 : 16,
                duration: 250
            })
        ]).start();
    };

    renderIcon = (iconButton, iconColorButton) => (
        <Icon name={iconButton} color={iconColorButton} size={24} />
    );

    onPressAction = (onPress: Function) => {
        if (onPress) {
            onPress();
        }

        this.reset();
    };

    onPressMain = () => {
        const { onPress } = this.props;

        if (onPress) {
            onPress();
        }
    };

    updateState = (nextState: State, callback: Function) => {
        this.setState(nextState, () => {
            if (callback) {
                callback();
            }
        });
    };

    reset = () => {
        const { onClose, iconButton } = this.props;

        Animated.spring(this.animation, {
            toValue: 0,
            useNativeDriver: true
        }).start();
        Animated.spring(this.actionsAnimation, { toValue: 0 }).start();

        this.updateState({ active: false, iconMain: iconButton }, () => {
            if (onClose) {
                onClose();
            }
        });
    };

    animateButton = () => {
        const { dismissKeyboardOnPress, actions, onOpen } = this.props;
        const { active } = this.state;

        if (dismissKeyboardOnPress) {
            Keyboard.dismiss();
        }

        this.onPressMain();

        if (!active) {
            if (!isEmpty(actions)) {
                this.setState({ iconMain: 'add' });
                // Anima o botão para exibir as ações
                Animated.spring(this.animation, {
                    toValue: 1,
                    useNativeDriver: true
                }).start();
            }

            // Anima o layout para as ações
            Animated.spring(this.actionsAnimation, { toValue: 1 }).start();

            LayoutAnimation.configureNext({
                duration: 150,
                create: {
                    type: LayoutAnimation.Types.easeInEaseOut,
                    property: LayoutAnimation.Properties.opacity
                }
            });

            this.updateState(
                {
                    active: true
                },
                () => {
                    if (onOpen) {
                        onOpen();
                    }
                }
            );
        } else {
            this.reset();
        }
    };

    renderFab = () => {
        const { colorButton, iconColorButton, position, theme } = this.props;
        const { iconMain, orientation } = this.state;

        const buttonColor = colorButton || theme.palette.colorAccent;

        const animatedVisibleView = {
            opacity: this.fadeAnimation,
            transform: [
                {
                    rotate: this.visibleAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0deg', '90deg']
                    })
                },
                {
                    scale: this.visibleAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [1, 0]
                    })
                }
            ]
        };

        const animatedViewStyle = {
            transform: [
                {
                    rotate: this.animation.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0deg', '45deg']
                    })
                }
            ]
        };

        const styleProps = [
            styles.fabContainer,
            animatedVisibleView,
            {
                backgroundColor: buttonColor,
                bottom: this.mainBottomAnimation,
                ...(['left', 'right'].indexOf(position) > -1
                    ? { [position]: 16 }
                    : null),
                ...(orientation === 'landscape' && isIphoneX()
                    ? { marginHorizontal: 32 }
                    : null)
            }
        ];

        const rippleProps = {
            style: styles.rippleFab,
            containerBorderRadius: FAB_SIZE / 2,
            onPress: this.animateButton
        };

        const animatedProps = [styles.contentRipple, animatedViewStyle];

        return (
            <Animated.View style={styleProps} accessible>
                <Ripple {...rippleProps}>
                    <Animated.View style={animatedProps}>
                        {this.renderIcon(iconMain, iconColorButton)}
                    </Animated.View>
                </Ripple>
            </Animated.View>
        );
    };

    renderActions = () => {
        const { actions, position, theme } = this.props;
        const { active, orientation } = this.state;

        if (isEmpty(actions)) {
            return null;
        }

        const animatedActionStyle = {
            opacity: this.actionsAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 1]
            })
        };

        const actionsStyles = [
            styles.actions,
            styles[`${position}Actions`],
            animatedActionStyle,
            {
                bottom: this.actionsBottomAnimation,
                ...(orientation === 'landscape' && isIphoneX()
                    ? { paddingHorizontal: 32 }
                    : null)
            }
        ];

        if (active) {
            actionsStyles.push(styles[`${position}ActionsVisible`]);
        }

        return (
            <Animated.View style={actionsStyles} pointerEvents="box-none">
                {actions.map((action, index) => {
                    // eslint-disable-next-line prettier/prettier
                    const actionColor = action.actionColor || theme.palette.colorAccent;
                    const onPress = () => this.onPressAction(action.onPress);

                    const actionProps = {
                        ...action,
                        actionColor,
                        onPress
                    };

                    const fabItemProps = {
                        key: index,
                        active,
                        position,
                        ...actionProps,
                        id: `${index}action`
                    };

                    if (index > 4) {
                        return null;
                    }

                    return <FloatingActionButtonItem {...fabItemProps} />;
                })}
            </Animated.View>
        );
    };

    renderOverlayOnPress = () => {
        const { overlayColor } = this.props;

        const overlayProps = [
            styles.overlay,
            { backgroundColor: overlayColor }
        ];

        return <TouchableOpacity style={overlayProps} onPress={this.reset} />;
    };

    render() {
        const { active } = this.state;

        const overlayProps = [
            styles.overlay,
            { backgroundColor: 'transparent' }
        ];

        return (
            <Animated.View style={overlayProps} pointerEvents="box-none">
                {active && this.renderOverlayOnPress()}
                {this.renderActions()}
                {this.renderFab()}
            </Animated.View>
        );
    }
}

FloatingActionButton.propTypes = {
    actions: PropTypes.arrayOf(
        PropTypes.shape({
            iconName: PropTypes.string,
            iconColor: PropTypes.string,
            imgResource: PropTypes.number,
            actionColor: PropTypes.string,
            labelTooltip: PropTypes.string,
            colorLabelTooltip: PropTypes.string,
            colorTooltip: PropTypes.string,
            onPress: PropTypes.func.isRequired
        })
    ),
    colorButton: PropTypes.string,
    iconButton: PropTypes.string.isRequired,
    iconColorButton: PropTypes.string.isRequired,
    visible: PropTypes.bool,
    overlayColor: PropTypes.string,
    listenKeyboard: PropTypes.bool,
    position: PropTypes.oneOf(['left', 'right', 'center']).isRequired,
    dismissKeyboardOnPress: PropTypes.func,
    onPress: PropTypes.func.isRequired,
    onClose: PropTypes.func,
    onOpen: PropTypes.func
};

export default withTheme(FloatingActionButton);
