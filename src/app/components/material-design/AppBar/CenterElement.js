/* eslint-disable arrow-parens */
/* @flow */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { Animated, TextInput, Easing, StyleSheet } from 'react-native';

import color from 'color';

import * as Colors from '../colors';
import Typography from '../Typography';
import Ripple from '../RippleEffect';

import type { ThemeDefault } from '../types/ThemeType';

type Props = {
    +isSearchActive: boolean,
    +searchValue: string,
    +searchable?: {
        +onSubmitEditing?: Function,
        +autoFocus?: boolean,
        +autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters',
        +autoCorrect?: boolean,
        +onChangeText?: Function,
        +placeholder?: string
    },
    +centerElement: any,
    +onCenterElementPress: Function,
    +onSearchTextChange: Function,
    +theme: ThemeDefault
};

type State = {
    +isSearchActive: boolean,
    +opacityValue: Animated.Value
};

const styles = StyleSheet.create({
    textInput: {
        borderWidth: 0,
        width: '100%',
        fontWeight: '400',
        fontSize: 16,
        letterSpacing: 0.15,
        fontFamily: 'Roboto'
    },
    centerElementContainer: {
        flex: 1,
        alignItems: 'flex-start',
        justifyContent: 'center'
    }
});

class CenterElement extends PureComponent<Props, State> {
    static defaultProps = {
        onCenterElementPress: null,
        centerElement: null,
        searchable: null
    };

    searchFieldRef: any;

    constructor(props: Props) {
        super(props);

        this.state = {
            isSearchActive: props.isSearchActive,
            opacityValue: new Animated.Value(1)
        };
    }

    componentDidUpdate(prevProps: Props) {
        const { isSearchActive } = this.props;

        if (isSearchActive !== prevProps.isSearchActive) {
            this.animateElements(isSearchActive);
        }
    }

    animateElements = (nextIsSearchActive: boolean) => {
        const { opacityValue } = this.state;
        Animated.timing(opacityValue, {
            toValue: 0,
            duration: 112,
            easing: Easing.linear,
            useNativeDriver: true
        }).start(() => {
            this.setState({ isSearchActive: nextIsSearchActive });

            Animated.timing(opacityValue, {
                toValue: 1,
                duration: 112,
                easing: Easing.linear,
                useNativeDriver: true
            }).start();
        });
    };

    render() {
        const {
            searchable,
            centerElement,
            onCenterElementPress,
            onSearchTextChange,
            searchValue,
            theme
        } = this.props;

        const { opacityValue, isSearchActive } = this.state;

        /**
         * Pode ocorrer a situação seguinte
         * 1. Dada barra de ferramentas com titulo e recurso pesquisável
         * 2. O usuário pressiona o ícone de pesquisa - isSearchActive == true
         * 3. O usuário escreve algum texto de pesquisa e seleciona itens pesquisados na lista
         * 4. Então será necessário msotrar ao usuário que ele tem 'n' itens selecionados
         * 5. Então você renderiza a barra de ferramentas com outros objetos como centerElement
         */

        let content = null;

        if (searchable && isSearchActive) {
            const textInputProps = {
                // eslint-disable-next-line no-return-assign
                ref: (ref) => (this.searchFieldRef = ref),
                autoFocus: searchable.autoFocus,
                autoCapitalize: searchable.autoCapitalize,
                onChangeText: onSearchTextChange,
                onSubmitEditing: searchable.onSubmitEditing,
                placeholder: searchable.placeholder,
                placeholderTextColor: theme.palette.textColorSecondary,
                style: [
                    styles.textInput,
                    { marginLeft: 0, color: theme.palette.textColorPrimary }
                ],
                underlineColorAndroid: 'transparent',
                value: searchValue,
                multiline: false,
                numberOfLines: 1
            };

            content = <TextInput {...textInputProps} />;
        } else if (typeof centerElement === 'string') {
            const styleTypography = {
                paddingLeft: 16,
                color: color(theme.palette.colorPrimary).isDark()
                    ? Colors.white[1000]
                    : theme.palette.textColorPrimary
            };

            const typographyProps = {
                variant: 'h6',
                gutterBottom: false,
                styles: styleTypography
            };

            content = (
                <Typography {...typographyProps}>{centerElement}</Typography>
            );
        } else {
            content = centerElement;
        }

        const styleAnimatedView = [
            styles.centerElementContainer,
            { opacity: opacityValue }
        ];

        if (onCenterElementPress) {
            const rippleProps = {
                style: { flex: 1 },
                onPress: () => onCenterElementPress()
            };

            return (
                <Ripple key="center" {...rippleProps}>
                    <Animated.View style={styleAnimatedView}>
                        {content}
                    </Animated.View>
                </Ripple>
            );
        }

        return (
            <Animated.View style={styleAnimatedView}>{content}</Animated.View>
        );
    }
}

CenterElement.propTypes = {
    isSearchActive: PropTypes.bool.isRequired,
    searchValue: PropTypes.string.isRequired,
    searchable: PropTypes.shape({
        onSubmitEditing: PropTypes.func.isRequired,
        autoFocus: PropTypes.bool,
        autoCapitalize: TextInput.propTypes.autoCapitalize,
        autoCorrect: PropTypes.bool,
        onChangeText: PropTypes.func,
        placeholder: PropTypes.string
    }),
    centerElement: PropTypes.node,
    onCenterElementPress: PropTypes.func,
    onSearchTextChange: PropTypes.func.isRequired
};

export default CenterElement;
