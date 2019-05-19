/* @flow */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { StyleSheet, View, Animated, Dimensions } from 'react-native';

import Color from 'color';

import Button from '../Button';
import Typography from '../Typography';
import Icon from '../Icon';
import * as Colors from '../colors';

import { withTheme } from '../styles';
import { isEmpty } from '../util';
import { isIphoneX } from '../util/platform';

import type { ThemeDefault } from '../types/ThemeType';

type Actions = {
    +label: string,
    +color?: string,
    +onPress: Function
};

type Props = {
    +visible: boolean,
    +numberOfLines: '1' | '2',
    +message: string,
    +actions: Array<Actions>,
    +iconProps?: {
        +name: string,
        +color: string,
        +backgroundColor?: string
    },
    +theme: ThemeDefault
};

type State = {
    +visible: boolean,
    +orientation: 'portrait' | 'landscape'
};

const styles = StyleSheet.create({
    root: {
        width: '100%',
        minHeight: 54,
        maxHeight: 120,
        top: 0,
        left: 0,
        right: 0,
        zIndex: -1,
        backgroundColor: Colors.white[1000],
        borderBottomColor: Color(Colors.black[1000])
            .alpha(0.12)
            .toString(),
        borderBottomWidth: 1
    },
    contentOneLine: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        flex: 1,
        paddingLeft: 16,
        paddingRight: 8
    },
    contentTwoLine: {
        minHeight: 54,
        maxHeight: 120,
        paddingLeft: 16,
        paddingRight: 8,
        paddingTop: 24,
        paddingBottom: 8
    },
    contentMessageWithIcon: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    contentButtons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    icon: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16
    }
});

class Banner extends PureComponent<Props, State> {
    static defaultProps = {
        iconProps: null
    };

    positionValue: any;

    orientationListener: any;

    constructor(props: Props) {
        super(props);

        this.positionValue = new Animated.Value(0);

        this.state = {
            visible: props.visible,
            orientation: 'portrait'
        };
    }

    static getDerivedStateFromProps(props: Props, state: State) {
        if (props.visible !== state.visible) {
            return {
                visible: props.visible
            };
        }

        return null;
    }

    componentDidMount() {
        this.orientationListener = Dimensions.addEventListener(
            'change',
            this.handlerOrientation
        );
    }

    componentDidUpdate(prevProps: Props) {
        const { visible } = this.props;

        if (prevProps.visible !== visible) {
            if (visible) {
                this.show();
            } else {
                this.hide(null);
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

    show = () => {
        Animated.parallel([
            Animated.timing(this.positionValue, {
                toValue: 0,
                duration: 225
            })
        ]).start();
    };

    hide = (callback: Function) => {
        const { numberOfLines } = this.props;
        const { visible } = this.state;

        const value = numberOfLines === '1' ? 54 : 120;

        Animated.parallel([
            Animated.timing(this.positionValue, {
                toValue: -1 * value,
                duration: 225
            })
        ]).start(() => {
            if (callback) {
                callback(!visible);
            }

            this.setState({ visible: false });
        });
    };

    onPress = (onClick: Function) => {
        this.hide(onClick);
    };

    render() {
        const {
            numberOfLines,
            message,
            actions,
            iconProps,
            theme
        } = this.props;
        const { visible, orientation } = this.state;

        if (!visible) {
            return null;
        }

        let typographyProps = {
            variant: 'body2',
            gutterBottom: false,
            styles: { flex: 1 }
        };

        let propButton = null;

        if (actions && actions[0]) {
            propButton = {
                textColor: actions[0].color,
                onPress: () => this.onPress(actions[0].onPress)
            };
        }

        let content = (
            <View style={styles.contentOneLine}>
                <Typography {...typographyProps}>{message}</Typography>
                {actions && actions[0] ? (
                    <Button {...propButton}>{actions[0].label}</Button>
                ) : null}
            </View>
        );

        if (numberOfLines === '2') {
            typographyProps = {
                variant: 'body2',
                gutterBottom: true,
                numberOfLines: 2,
                styles: { maxWidth: '100%' }
            };

            let contentMessage = (
                <Typography {...typographyProps}>{message}</Typography>
            );

            if (!isEmpty(iconProps)) {
                const styleConteinerIcon = [
                    styles.icon,
                    {
                        // $FlowFixMe
                        backgroundColor: iconProps.backgroundColor,
                        borderRadius: 20
                    }
                ];

                const icon = {
                    // $FlowFixMe
                    name: iconProps.name,
                    // $FlowFixMe
                    color: iconProps.color,
                    size: 24
                };

                // $FlowFixMe
                typographyProps.styles = { width: '78.61%' };

                contentMessage = (
                    <View style={styles.contentMessageWithIcon}>
                        <View style={styleConteinerIcon}>
                            <Icon {...icon} />
                        </View>
                        <Typography {...typographyProps}>{message}</Typography>
                    </View>
                );
            }

            content = (
                <View style={styles.contentTwoLine}>
                    {contentMessage}
                    {actions ? (
                        <View style={styles.contentButtons}>
                            {actions.map((item, index) => {
                                const buttonProps = {
                                    key: index,
                                    textColor: item.color,
                                    onPress: () => this.onPress(item.onPress)
                                };

                                return (
                                    <Button {...buttonProps}>
                                        {item.label}
                                    </Button>
                                );
                            })}
                        </View>
                    ) : null}
                </View>
            );
        }

        const styleRootView = [
            styles.root,
            {
                backgroundColor:
                    theme.variant === 'dark'
                        ? Colors.grey[800]
                        : Colors.white[1000],
                transform: [{ translateY: this.positionValue }],
                ...(orientation === 'landscape' && isIphoneX()
                    ? { paddingRight: 36, paddingLeft: 32 }
                    : null)
            }
        ];

        return <Animated.View style={styleRootView}>{content}</Animated.View>;
    }
}

Banner.propTypes = {
    visible: PropTypes.bool.isRequired,
    numberOfLines: PropTypes.oneOf(['1', '2']).isRequired,
    message: PropTypes.string.isRequired,
    actions: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string,
            color: PropTypes.string,
            onPress: PropTypes.func
        })
    ).isRequired,
    iconProps: PropTypes.shape({
        name: PropTypes.string,
        color: PropTypes.string,
        backgroundColor: PropTypes.string
    })
};

export default withTheme(Banner);
