/* eslint-disable no-nested-ternary */
/* @flow */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { Animated, StyleSheet, View, Platform, Dimensions } from 'react-native';

import { withTheme } from '../styles';
import * as Colors from '../colors';
import StatusBar from '../StatusBar';

import LeftElement from './LeftElement';
import CenterElement from './CenterElement';
import RightElement from './RightElement';

import { isFunction } from '../util';

import { getBackButtonListener } from '../util/platform';

import type { ThemeDefault } from '../types/ThemeType';
import type { Layout } from '../types/CoreEvents';

export type SearchableAppBar = {
    +onChangeText?: Function,
    +onSearchClosed?: Function,
    +onSearchCloseRequested?: Function,
    +onSearchPressed?: Function,
    +onSubmitEditing?: Function,
    +placeholder?: string,
    +autoFocus?: boolean,
    +autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters',
    +autoCorrect?: boolean
};

type RightElementActionsProps = {
    +actions?: Array<string | any>,
    +menu?: {
        +icon?: string,
        +labels: Array<string>
    }
};

type Props = {
    +imgSource?: number | null,
    +isSearchActive?: boolean,
    +searchable?: SearchableAppBar | null,
    +hidden?: boolean,
    +onCenterElementPress?: Function,
    +leftElement?: string | any,
    +onLeftElementPress?: Function,
    +centerElement?: string | any,
    +rightElement?: any | string | Array<string> | RightElementActionsProps,
    +onRightElementPress?: Function,
    +theme: ThemeDefault
};

type State = {
    +isSearchActive: boolean,
    +searchValue: string,
    +defaultInterpolateValue: Animated.Value,
    +defaultOpacityValue: Animated.Value,
    +disableInterpolate: boolean,
    +heightValue: Animated.Value,
    +positionValue: Animated.Value,
    +orientation: 'portrait' | 'landscape'
};

const ACTION_BAR_SIZE = 56;

const styles = StyleSheet.create({
    outerContainer: {
        height: ACTION_BAR_SIZE,
        top: 0,
        left: 0,
        right: 0,
        zIndex: 999,
        ...Platform.select({
            ios: {
                shadowColor: Colors.black[1000],
                shadowOpacity: 0.3,
                shadowRadius: 2,
                shadowOffset: {
                    height: 2,
                    width: 0
                }
            },
            android: {
                elevation: Platform.Version >= 21 ? 4 : 0
            }
        })
    },
    innerContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 4,
        paddingVertical: 4,
        zIndex: 1
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
        flex: 1
    }
});

class AppBar extends PureComponent<Props, State> {
    static defaultProps = {
        imgSource: null,
        hidden: false,
        isSearchActive: false,
        searchable: null,
        rightElement: null,
        centerElement: null,
        leftElement: null,
        onRightElementPress: null,
        onCenterElementPress: null,
        onLeftElementPress: null
    };

    backButtonListener: Function | typeof undefined | null;

    searchFieldRef: any;

    orientationListener: any;

    constructor(props: Props) {
        super(props);

        const isSearchActive = props.isSearchActive || false;

        this.backButtonListener = isSearchActive
            ? getBackButtonListener(this.onSearchCloseRequested)
            : null;

        this.state = {
            isSearchActive,
            searchValue: '',
            defaultInterpolateValue: new Animated.Value(0),
            defaultOpacityValue: new Animated.Value(1),
            disableInterpolate: false,
            heightValue: new Animated.Value(ACTION_BAR_SIZE),
            positionValue: new Animated.Value(0),
            orientation: 'portrait'
        };
    }

    componentDidMount() {
        this.orientationListener = Dimensions.addEventListener(
            'change',
            this.handlerOrientation
        );
    }

    componentDidUpdate(prevProps: Props) {
        const { searchable, hidden, isSearchActive } = this.props;
        // $FlowFixMe
        const { searchActive = isSearchActive } = this.state;
        // se a pesquisa estiver ativa e clicamos nos resultados que não permitem pesquisa
        // em seguida, feche a pesquisa anterior
        if (searchActive && !searchable) {
            this.onSearchCloseRequested();
        }

        // também deve haver possibilidade de mudar a busca por adereços, então precisamos verificar
        // props primeiro, e em seguida, devemos verificar o estado, para ver se precisamos mudar o estado de busca
        if (isSearchActive !== prevProps.isSearchActive) {
            // porque this.props.isSearchActive poderia ser nulo ou indefinido
            // por isso precisamos convertê-lo para boolean
            const nextIsSearchActive = !!isSearchActive;
            if (searchActive !== nextIsSearchActive) {
                if (nextIsSearchActive) {
                    this.onSearchOpenRequested();
                } else {
                    this.onSearchCloseRequested();
                }
            }
        }

        // se props "hidden" foir alterado, devemos animar executando "show" ou "hide"
        if (hidden !== prevProps.hidden) {
            if (hidden === true) {
                this.hide();
            } else {
                this.show();
            }
        }
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

    onSearchOpenRequested = () => {
        this.setState({
            isSearchActive: true,
            searchValue: '',
            disableInterpolate: false
        });

        const { defaultInterpolateValue, defaultOpacityValue } = this.state;

        defaultInterpolateValue.setValue(0);
        defaultOpacityValue.setValue(0);

        this.animateDefaultBackground(() => {
            // no Android é tipico o botão voltar da barra de vageação fechar a busca
            this.backButtonListener = getBackButtonListener(
                this.onSearchOpenRequested
            );
        });
    };

    onSearchPressed = () => {
        this.onSearchOpenRequested();

        const { searchable } = this.props;

        if (searchable && isFunction(searchable.onSearchPressed)) {
            // $FlowFixMe
            searchable.onSearchPressed();
        }
    };

    onSearchTextChanged = (value: string) => {
        const { searchable } = this.props;

        if (searchable && isFunction(searchable.onChangeText)) {
            // $FlowFixMe
            searchable.onChangeText(value);
        }

        this.setState({ searchValue: value });
    };

    onSearchClearRequested = () => {
        this.onSearchTextChanged('');
    };

    /**
     * Android's HW/SW back button
     */
    onSearchCloseRequested = () => {
        const { searchable } = this.props;

        if (searchable && searchable.onSearchCloseRequested) {
            searchable.onSearchCloseRequested();
        }

        this.setState({
            isSearchActive: false,
            searchValue: '',
            disableInterpolate: true
        });

        const { defaultInterpolateValue, defaultOpacityValue } = this.state;

        defaultInterpolateValue.setValue(0);
        defaultOpacityValue.setValue(1);

        this.animateDefaultBackground(() => {
            this.onSearchClosed();
        });

        // because we need to stop propagation
    };

    onSearchClosed = () => {
        const { searchable } = this.props;

        if (this.backButtonListener) {
            this.backButtonListener.remove();
        }

        if (searchable && isFunction(searchable.onSearchClosed)) {
            // $FlowFixMe
            searchable.onSearchClosed();
        }
    };

    animateDefaultBackground = (onComplete: Function) => {
        const {
            defaultInterpolateValue,
            defaultOpacityValue,
            isSearchActive
        } = this.state;
        Animated.parallel([
            Animated.timing(defaultInterpolateValue, {
                toValue: 150,
                duration: 325
            }),
            Animated.timing(defaultOpacityValue, {
                toValue: isSearchActive ? 0 : 1,
                duration: 325
            })
        ]).start(onComplete);
    };

    focusSearchField() {
        this.searchFieldRef.focus();
    }

    show = () => {
        const { heightValue, positionValue } = this.state;
        Animated.parallel([
            Animated.timing(heightValue, {
                toValue: ACTION_BAR_SIZE,
                duration: 225
            }),
            Animated.timing(positionValue, {
                toValue: 0,
                duration: 225
            })
        ]).start();
    };

    hide = () => {
        const { heightValue, positionValue } = this.state;
        Animated.parallel([
            Animated.timing(heightValue, {
                toValue: 0,
                duration: 225
            }),
            Animated.timing(positionValue, {
                toValue: -1 * ACTION_BAR_SIZE,
                duration: 225
            })
        ]).start();
    };

    renderStatusBar = (
        isSearchActive: boolean,
        interpolateStatusBarColor: any,
        hidden: boolean | typeof undefined
    ) => {
        const { theme } = this.props;

        const { variant } = theme;

        // eslint-disable-next-line prettier/prettier
        const barStyle = variant === 'white' ? isSearchActive ? 'dark-content' : 'light-content' : 'light-content';
        // eslint-disable-next-line prettier/prettier
        const backgroundColor = variant === 'white'
                ? isSearchActive
                    ? Colors.grey[400]
                    : theme.palette.colorPrimaryDark
                : theme.palette.colorPrimaryDark;

        const statusBarProps = {
            color: backgroundColor,
            colorIos: interpolateStatusBarColor,
            hidden,
            barStyle
        };

        return <StatusBar {...statusBarProps} />;
    };

    renderImageBackground = (
        imgSource: number | null | typeof undefined,
        opacity: any
    ) => {
        if (imgSource) {
            const styleProps = [styles.image, { opacity }];

            return <Animated.Image style={styleProps} source={imgSource} />;
        }

        return null;
    };

    render() {
        const {
            onLeftElementPress,
            onCenterElementPress,
            onRightElementPress,
            imgSource,
            hidden,
            theme
        } = this.props;

        const {
            isSearchActive,
            searchValue,
            disableInterpolate,
            defaultInterpolateValue,
            defaultOpacityValue,
            heightValue,
            positionValue,
            orientation
        } = this.state;

        const { variant } = theme;

        const interpolateColor = defaultInterpolateValue.interpolate({
            inputRange: [0, 150],
            outputRange: disableInterpolate
                ? [
                      variant === 'white'
                          ? Colors.white[1000]
                          : theme.palette.colorPrimary,
                      theme.palette.colorPrimary
                  ]
                : [
                      theme.palette.colorPrimary,
                      variant === 'white'
                          ? Colors.white[1000]
                          : theme.palette.colorPrimary
                  ]
        });

        const interpolateStatusBarColor = defaultInterpolateValue.interpolate({
            inputRange: [0, 150],
            outputRange: disableInterpolate
                ? [
                      variant === 'white'
                          ? Colors.grey[400]
                          : theme.palette.colorPrimaryDark,
                      theme.palette.colorPrimaryDark
                  ]
                : [
                      theme.palette.colorPrimaryDark,
                      variant === 'white'
                          ? Colors.grey[400]
                          : theme.palette.colorPrimaryDark
                  ]
        });

        const shadowInterpolate = defaultInterpolateValue.interpolate({
            inputRange: [0, 150],
            outputRange: [2, 2]
        });

        const styleProps = [
            styles.outerContainer,
            {
                backgroundColor: interpolateColor,
                shadowOffset: {
                    width: 0,
                    height: shadowInterpolate,
                    zIndex: 1200
                },
                height: heightValue,
                transform: [{ translateY: positionValue }]
            }
        ];

        const leftElementProps = {
            ...this.props,
            onLeftElementPress,
            isSearchActive,
            onSearchClose: () => this.onSearchCloseRequested(),
            orientation
        };

        const centerElementProps = {
            ...this.props,
            onCenterElementPress,
            searchValue,
            isSearchActive,
            // eslint-disable-next-line arrow-parens
            onSearchTextChange: (value) => this.onSearchTextChanged(value)
        };

        const rightElementProps = {
            ...this.props,
            searchValue,
            isSearchActive,
            onSearchPress: () => this.onSearchPressed(),
            onSearchClearRequest: () => this.onSearchClearRequested(),
            onRightElementPress,
            orientation
        };

        return (
            <View>
                {this.renderStatusBar(
                    isSearchActive,
                    interpolateStatusBarColor,
                    hidden
                )}
                <Animated.View style={styleProps}>
                    {this.renderImageBackground(imgSource, defaultOpacityValue)}
                    <View style={styles.innerContainer}>
                        <LeftElement {...leftElementProps} />
                        {/* $FlowFixMe */}
                        <CenterElement {...centerElementProps} />
                        <RightElement {...rightElementProps} />
                    </View>
                </Animated.View>
            </View>
        );
    }
}

AppBar.propTypes = {
    /**
     * Background image Toolbar
     */
    imgSource: PropTypes.number,
    /**
     * Indicates if search is active or not
     */
    isSearchActive: PropTypes.bool,
    /**
     * When you want to activate search feature you have to pass this object with config of search.
     */
    searchable: PropTypes.shape({
        /**
         * Called when search text was changed.
         */
        onChangeText: PropTypes.func,
        /**
         * Called when search was closed.
         */
        onSearchClosed: PropTypes.func,
        /**
         * Called when action to close search was requested.
         */
        onSearchCloseRequested: PropTypes.func,
        /**
         * Called when search was opened.
         */
        onSearchPressed: PropTypes.func,
        /**
         * Called when user press submit button on hw keyboard
         */
        onSubmitEditing: PropTypes.func,
        /**
         * Will shown as placeholder for search input.
         */
        placeholder: PropTypes.string,
        /**
         * Indicates when input should be focused after the search is opened.
         */
        autoFocus: PropTypes.bool,
        /**
         * Enable auto-capitalize for search input
         */
        autoCapitalize: PropTypes.string,
        /**
         * Enable auto-correct for search input
         */
        autoCorrect: PropTypes.bool
    }),
    /**
     * Wether or not the Toolbar should show
     */
    hidden: PropTypes.bool,
    /**
     * Called when centerElement was pressed.
     */
    onCenterElementPress: PropTypes.func,
    /**
     * Will be shown on the left side.
     */
    leftElement: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
    /**
     * Called when leftElement was pressed.
     */
    onLeftElementPress: PropTypes.func,
    /**
     * Will be shown between leftElement and rightElement. Usually use for title.
     */
    centerElement: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
    /**
     * Will be shown on the right side.
     */
    rightElement: PropTypes.oneOfType([
        /**
         * Whatever you want to have on the right side
         */
        PropTypes.element,
        /**
         * One action (name of icon). Alias for ['icon1'].
         */
        PropTypes.string,
        /**
         * For many actions: ['icon1', 'icon2', ...]
         */
        PropTypes.arrayOf(PropTypes.string),
        /**
         * For actions and menu. The menu will be shown as last one icon.
         */
        PropTypes.shape({
            actions: PropTypes.arrayOf(
                PropTypes.oneOfType([PropTypes.element, PropTypes.string])
            ),
            menu: PropTypes.shape({
                icon: PropTypes.string,
                labels: PropTypes.arrayOf(PropTypes.string)
            })
        })
    ]),
    /**
     * Called when rightElement was pressed.
     */
    onRightElementPress: PropTypes.func
};

export default withTheme(AppBar);
