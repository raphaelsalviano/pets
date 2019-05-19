/* eslint-disable array-callback-return */
/* @flow */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import {
    View,
    StyleSheet,
    NativeModules,
    findNodeHandle,
    Platform
} from 'react-native';

import color from 'color';

import ToggleButton from '../ToggleButton';
import Menu from '../Menu';
import * as Colors from '../colors';

import { isFunction } from '../util';
import { isIphoneX } from '../util/platform';

import type { ThemeDefault } from '../types/ThemeType';
import type SearchableProps from './AppBar';

type RightElementActionsProps = {
    +actions?: Array<string | any>,
    +menu?: {
        +icon?: string,
        +labels: Array<string>
    }
};

type Props = {
    +rightElementID?: string | null,
    +isSearchActive: boolean,
    +searchValue: string,
    +searchable?: ?SearchableProps,
    +size?: number,
    +rightElement?: any | string | Array<string> | RightElementActionsProps,
    +onRightElementPress: Function,
    +onSearchClearRequest: Function,
    +onSearchPress: Function,
    +theme: ThemeDefault,
    +orientation: 'portrait' | 'landscape'
};

type State = {};

const { UIManager } = NativeModules;

const styles = StyleSheet.create({
    rightElementContainer: {
        paddingRight: 4,
        flexDirection: 'row',
        backgroundColor: 'transparent'
    },
    menuAndroid: {
        backgroundColor: 'transparent',
        width: 1,
        height: StyleSheet.hairlineWidth
    }
});

class RightElement extends PureComponent<Props, State> {
    static defaultProps = {
        rightElementID: null,
        rightElement: null,
        onRightElementPress: null,
        size: 24,
        searchable: null
    };

    menu: any;

    onMenuPressed = (labels: Array<string>) => {
        const { onRightElementPress } = this.props;

        if (Platform.OS === 'android') {
            UIManager.showPopupMenu(
                findNodeHandle(this.menu),
                labels,
                () => {},
                (result, index) => {
                    if (onRightElementPress) {
                        onRightElementPress({ action: 'menu', result, index });
                    }
                }
            );
        } else {
            // eslint-disable-next-line no-underscore-dangle
            this.menu._root.show();
        }
    };

    onSearchPressed = () => {
        const { onSearchPress } = this.props;

        if (isFunction(onSearchPress)) {
            onSearchPress();
        }
    };

    onRightElementPress = ({
        action,
        index
    }: {
        action: string,
        index: any
    }) => {
        const { onRightElementPress } = this.props;

        if (onRightElementPress) {
            onRightElementPress({ action, index });
        }
    };

    getRefMenu = (menu: any) => {
        this.menu = menu;
    };

    renderMenuIos = () => {
        const { rightElement, theme } = this.props;

        const toggleButtonProps = {
            // $FlowFixMe
            id: rightElement.menu.icon || 'more-vert',
            // $FlowFixMe
            iconName: rightElement.menu.icon || 'more-vert',
            iconColor: color(theme.palette.colorPrimary).isDark()
                ? Colors.white[1000]
                : theme.palette.textColorPrimary,
            rippleColor: color(theme.palette.colorPrimary).isDark()
                ? Colors.white[1000]
                : theme.palette.textColorPrimary,
            // $FlowFixMe
            onPress: () => this.onMenuPressed(rightElement.menu.labels)
        };

        if (Platform.OS !== 'ios') {
            return <ToggleButton key="more-vert" {...toggleButtonProps} />;
        }

        const itens = [];

        // $FlowFixMe
        rightElement.menu.labels.map((action, index) => {
            itens.push({
                label: action,
                onPress: () => this.onRightElementPress({ action, index })
            });
        });

        const menuProps = {
            ref: this.getRefMenu,
            buttonComponent: (
                <ToggleButton key="more-vert" {...toggleButtonProps} />
            ),
            menuItems: itens,
            onClose: () => null,
            style: {}
        };

        return <Menu {...menuProps} />;
    };

    render() {
        const {
            rightElementID,
            isSearchActive,
            rightElement,
            searchable,
            searchValue,
            onSearchClearRequest,
            theme,
            orientation
        } = this.props;

        // se nao houver direito e a busca estiver desabilitada, então temos a certeza da direita é nada
        if (!rightElement && !searchable) {
            return null;
        }

        let actionsMap = [];
        let result = [];

        if (rightElement) {
            if (typeof rightElement === 'string') {
                actionsMap.push(rightElement);
            } else if (Array.isArray(rightElement)) {
                actionsMap = rightElement;
            } else if (rightElement.actions) {
                actionsMap = rightElement.actions;
            }
        }

        if (actionsMap) {
            result = actionsMap.map((action, index) => {
                if (React.isValidElement(action)) {
                    return action;
                }

                const toggleButtonProps = {
                    iconName: action,
                    iconColor: color(theme.palette.colorPrimary).isDark()
                        ? Colors.white[1000]
                        : theme.palette.textColorPrimary,
                    rippleColor: color(theme.palette.colorPrimary).isDark()
                        ? Colors.white[1000]
                        : theme.palette.textColorPrimary,
                    onPress: () => this.onRightElementPress({ action, index })
                };

                return <ToggleButton key={action} {...toggleButtonProps} />;
            });
        }

        if (React.isValidElement(rightElement)) {
            result.push(
                // $FlowFixMe
                React.cloneElement(rightElement, { key: 'customRightElement' })
            );
        }

        // se o recuros de busca estiver ativo e a pesquisa estiver ativa com algum texto,
        // mostraremos claramente o botão, para poder limpar o texto
        if (searchable) {
            if (isSearchActive) {
                // limpa o resultado e oculta os outros ícones
                result = [];

                if (searchValue.length > 0) {
                    const toggleButtonProps = {
                        iconName: 'close',
                        iconColor: theme.palette.textColorPrimary,
                        rippleColor: theme.palette.textColorPrimary,
                        onPress: onSearchClearRequest
                    };

                    result.push(
                        <ToggleButton key="close" {...toggleButtonProps} />
                    );
                }
            } else {
                const toggleButtonProps = {
                    iconName: 'search',
                    iconColor: color(theme.palette.colorPrimary).isDark()
                        ? Colors.white[1000]
                        : theme.palette.textColorPrimary,
                    rippleColor: color(theme.palette.colorPrimary).isDark()
                        ? Colors.white[1000]
                        : theme.palette.textColorPrimary,
                    onPress: this.onSearchPressed
                };

                result.unshift(
                    <ToggleButton key="search" {...toggleButtonProps} />
                );
            }
        }

        if (rightElement && rightElement.menu && !isSearchActive) {
            const menuRef = {
                ref: this.getRefMenu,
                style: styles.menuAndroid
            };

            const view = (
                <View key="menuIcon">
                    {Platform.OS === 'android' ? <View {...menuRef} /> : null}
                    {this.renderMenuIos()}
                </View>
            );

            result.push(view);
        }

        const stylesContainerRightElement = [
            styles.rightElementContainer,
            {
                ...(orientation === 'landscape' && isIphoneX()
                    ? { marginRight: 32 }
                    : null)
            }
        ];

        return (
            <View testID={rightElementID} style={stylesContainerRightElement}>
                {result}
            </View>
        );
    }
}

RightElement.propTypes = {
    rightElementID: PropTypes.string,
    isSearchActive: PropTypes.bool.isRequired,
    searchValue: PropTypes.string.isRequired,
    searchable: PropTypes.object,
    size: PropTypes.number,
    rightElement: PropTypes.any,
    onRightElementPress: PropTypes.func,
    onSearchClearRequest: PropTypes.func.isRequired,
    onSearchPress: PropTypes.func.isRequired,
    orientation: PropTypes.oneOf(['portrait', 'landscape']).isRequired
};

export default RightElement;
