/* @flow */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { StyleSheet, Image, Animated, Platform, View } from 'react-native';

import { withTheme } from '../styles';
import * as Colors from '../colors';
import Ripple from '../RippleEffect';
import Icon from '../Icon';
import Typography from '../Typography';

export type ActionsProps = {
    +id: string,
    +active: boolean,
    +position: 'left' | 'right' | 'center',
    +iconName?: string,
    +iconColor?: string,
    +imgResource?: number,
    +actionColor?: string,
    +labelTooltip?: string,
    +colorLabelTooltip?: string,
    +colorTooltip?: string,
    +onPress: Function
};

type Props = ActionsProps;

type State = {};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        paddingVertical: 8,
        paddingHorizontal: 0
    },
    containerActions: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 0
    },
    actionContainer: {
        height: 40,
        width: 40,
        borderRadius: 20,
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
    actionButton: {
        flex: 1,
        paddingHorizontal: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20
    },
    image: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        resizeMode: 'cover',
        zIndex: -1,
        flex: 1,
        borderRadius: 20
    },
    // eslint-disable-next-line react-native/no-unused-styles
    leftTextContainer: {
        marginLeft: 16
    },
    // eslint-disable-next-line react-native/no-unused-styles
    rightTextContainer: {
        marginRight: 16
    },
    tooltip: {
        paddingHorizontal: 16,
        height: 32,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4
    }
});

class FloatingActionButtonItem extends PureComponent<Props, State> {
    static defaultProps = {
        iconName: null,
        iconColor: null,
        actionColor: null,
        imgResource: null,
        labelTooltip: null,
        colorLabelTooltip: Colors.white[1000],
        colorTooltip: 'rgba(97, 97, 97, 0.9)'
    };

    animation: Animated.Value;

    constructor(props: Props) {
        super(props);

        this.animation = new Animated.Value(0);
    }

    componentDidUpdate(prevProps: Props) {
        const { active } = this.props;

        if (active !== prevProps.active) {
            const value = active ? 1 : 0;

            Animated.spring(this.animation, { toValue: value }).start();
        }
    }

    onPress = () => {
        const { onPress } = this.props;

        if (onPress) {
            onPress();
        }
    };

    renderTooltip = () => {
        const {
            labelTooltip,
            colorTooltip,
            colorLabelTooltip,
            position,
            id
        } = this.props;

        if (!labelTooltip || position === 'center') {
            return null;
        }

        const tooltipStyles = [
            styles.tooltip,
            styles[`${position}TextContainer`],
            { backgroundColor: colorTooltip }
        ];

        const typographyProps = {
            variant: 'subtitle2',
            gutterBottom: false,
            styles: { color: colorLabelTooltip }
        };

        return (
            <View key={`${id}tooltip`} style={tooltipStyles}>
                <Typography {...typographyProps}>{labelTooltip}</Typography>
            </View>
        );
    };

    renderAction = () => {
        const {
            iconName,
            iconColor,
            imgResource,
            actionColor,
            id
        } = this.props;

        let content = null;

        if (iconName) {
            content = (
                <View style={styles.actionButton}>
                    <Icon name={iconName} color={iconColor} size={24} />
                </View>
            );
        }

        if (imgResource) {
            content = <Image style={styles.image} source={imgResource} />;
        }

        const stylesButton = [
            styles.actionContainer,
            { backgroundColor: actionColor }
        ];

        const rippleProps = {
            onPress: this.onPress,
            containerBorderRadius: 20,
            style: { flex: 1 }
        };

        return (
            <View key={`${id}ripple`} style={stylesButton}>
                <Ripple {...rippleProps}>{content}</Ripple>
            </View>
        );
    };

    render() {
        const { position, id } = this.props;

        const animatedActionContainerStyle = {
            marginBottom: this.animation.interpolate({
                inputRange: [0, 1],
                outputRange: [5, 10]
            })
        };

        const components = [];
        const distanceToEdgeActionContainer = {};

        if (position === 'left') {
            components.push(this.renderAction());
            components.push(this.renderTooltip());

            distanceToEdgeActionContainer.paddingLeft = 24;
        } else if (position === 'right') {
            components.push(this.renderTooltip());
            components.push(this.renderAction());

            distanceToEdgeActionContainer.paddingRight = 24;
        } else {
            components.push(this.renderAction());
        }

        const stylesRoot = [
            styles.container,
            animatedActionContainerStyle,
            distanceToEdgeActionContainer
        ];

        return (
            <Animated.View key={`${id}action`} style={stylesRoot}>
                <View style={styles.containerActions}>{components}</View>
            </Animated.View>
        );
    }
}

FloatingActionButtonItem.propTypes = {
    id: PropTypes.string.isRequired,
    active: PropTypes.bool.isRequired,
    position: PropTypes.oneOf(['left', 'right', 'center']).isRequired,
    iconName: PropTypes.string,
    iconColor: PropTypes.string,
    imgResource: PropTypes.number,
    actionColor: PropTypes.string,
    labelTooltip: PropTypes.string,
    colorLabelTooltip: PropTypes.string,
    colorTooltip: PropTypes.string,
    onPress: PropTypes.func.isRequired
};

export default withTheme(FloatingActionButtonItem);
