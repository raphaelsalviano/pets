/* @flow */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { StyleSheet, View, Animated, Platform, Dimensions } from 'react-native';

import Color from 'color';
import Button from '../Button';
import Typography from '../Typography';
import * as Colors from '../colors';

import { withTheme } from '../styles';

type Action = {
    +label: string,
    +color?: string,
    +onPress: Function
};

type Props = {
    +visible: boolean,
    +numberOfLines: '1' | '2',
    +message: string,
    +action: Action,
    +onClose?: Function | null,
    +distanceBotton: number
};

type State = {
    +visible: boolean
};

const styles = StyleSheet.create({
    root: {
        width: '100%',
        minHeight: 48,
        maxHeight: 120,
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1500,
        backgroundColor: Color(Colors.black[1000])
            .alpha(0.87)
            .toString(),
        borderRadius: 4,
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
    contentOneLine: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        flex: 1,
        paddingLeft: 16,
        paddingRight: 8
    },
    contentTwoLine: {
        minHeight: 48,
        maxHeight: 120,
        paddingLeft: 16,
        paddingRight: 16,
        paddingTop: 8,
        paddingBottom: 4
    },
    contentButtons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center'
    }
});

const DURATION_MEDIUM: number = 7000;
const HEIGHT_Y: number = Dimensions.get('window').height;

class Snackbar extends PureComponent<Props, State> {
    static defaultProps = {
        action: null,
        onClose: null
    };

    positionValue: Animated.Value;

    hideTimeout: TimeoutID;

    constructor(props: Props) {
        super(props);

        this.positionValue = new Animated.Value(
            HEIGHT_Y - props.distanceBotton
        );

        this.state = {
            visible: props.visible
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
        const { visible } = this.props;

        if (visible) {
            this.show();
        }
    }

    componentDidUpdate(prevProps: Props) {
        const { visible } = this.props;

        if (prevProps.visible !== visible) {
            if (visible) {
                this.show();
            }
        }
    }

    componentWillUnmount() {
        clearTimeout(this.hideTimeout);
    }

    show = () => {
        const { distanceBotton } = this.props;

        clearTimeout(this.hideTimeout);

        Animated.parallel([
            Animated.timing(this.positionValue, {
                toValue: HEIGHT_Y - distanceBotton,
                duration: 225
            })
        ]).start(() => {
            this.hideTimeout = setTimeout(() => {
                this.onClose(null);
            }, DURATION_MEDIUM);
        });
    };

    hide = (callback: Function | null) => {
        const { distanceBotton } = this.props;
        const { visible } = this.state;

        clearTimeout(this.hideTimeout);

        Animated.parallel([
            Animated.timing(this.positionValue, {
                toValue: HEIGHT_Y + distanceBotton,
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
        this.onClose(onClick);
    };

    onClose = (onClick: Function | null) => {
        const { onClose } = this.props;

        if (onClick) {
            this.hide(onClick);
        } else {
            // $FlowFixMe
            this.hide(onClose);
        }
    };

    render() {
        const { numberOfLines, message, action } = this.props;
        const { visible } = this.state;

        if (!visible) {
            return null;
        }

        let typographyProps = {
            variant: 'body2',
            gutterBottom: false,
            styles: {
                maxWidth: action ? '65.5%' : '100%',
                color: Colors.white[1000]
            }
        };

        let propButton = null;

        if (action) {
            propButton = {
                textColor: action.color,
                onPress: () => this.onPress(action.onPress)
            };
        }

        const style = [
            styles.contentOneLine,
            { marginRight: !action ? 16 : 8 }
        ];

        let content = (
            <View style={style}>
                <Typography {...typographyProps}>{message}</Typography>
                {action ? (
                    <Button {...propButton}>{action.label}</Button>
                ) : null}
            </View>
        );

        if (numberOfLines === '2') {
            typographyProps = {
                variant: 'body2',
                gutterBottom: true,
                numberOfLines: 2,
                styles: { maxWidth: '100%', color: Colors.white[1000] }
            };

            content = (
                <View style={styles.contentTwoLine}>
                    <Typography {...typographyProps}>{message}</Typography>
                    {action ? (
                        <View style={styles.contentButtons}>
                            <Button {...propButton}>{action.label}</Button>
                        </View>
                    ) : null}
                </View>
            );
        }

        const styleRootView = [
            styles.root,
            { transform: [{ translateY: this.positionValue }] }
        ];

        return <Animated.View style={styleRootView}>{content}</Animated.View>;
    }
}

Snackbar.propTypes = {
    visible: PropTypes.bool.isRequired,
    numberOfLines: PropTypes.oneOf(['1', '2']).isRequired,
    message: PropTypes.string.isRequired,
    action: PropTypes.shape({
        label: PropTypes.string,
        color: PropTypes.string,
        onPress: PropTypes.func
    }),
    onClose: PropTypes.func,
    distanceBotton: PropTypes.number.isRequired
};

export default withTheme(Snackbar);
