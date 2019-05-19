/* eslint-disable react/jsx-indent */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-return-assign */
/* eslint-disable arrow-parens */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable operator-linebreak */
/* @flow */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import {
    View,
    Animated,
    TextInput as NativeTextInput,
    Text,
    StyleSheet,
    I18nManager
} from 'react-native';

import color from 'color';

import type { Node } from 'react';
import { withTheme } from '../styles';
import * as Colors from '../colors';
import Typography from '../Typography';
import ToggleButton from '../ToggleButton';
import Icon from '../Icon';

import { isEmpty } from '../util';

import type { ThemeDefault } from '../types/ThemeType';

type RenderProps = {
    ref: (any) => void,
    onChangeText: (string) => void,
    placeholder: ?string,
    placeholderTextColor: string,
    editable?: boolean,
    selectionColor: string,
    onFocus: () => mixed,
    onBlur: () => mixed,
    underlineColorAndroid: string,
    style: any,
    multiline?: boolean,
    numberOfLines?: number,
    value?: string
};

type Adornments = {
    /**
     * O nome do icone
     */
    +iconName: string,
    /**
     * A cor do ícone
     */
    +iconColor?: string,
    /**
     * A cor do efeito `Ripple`
     */
    +rippleColor?: string,
    /**
     * O arredondamento das bordas do efeito Ripple
     */
    +rippleContainerRadius?: number,
    /**
     * Se a ação esta desabilitada
     */
    +disabled?: boolean,
    /**
     * Função chamada ao pressionar o ícone
     */
    +onPress?: Function
};

type Props = {
    /**
     * Variante do TextField
     * - `filled` - entrada plana com sublinhado e background de destaque
     * - `outlined` - entrada com destaque em esboço
     * - `default` - entrada plana com background transparente
     *
     * No modo `outlined`, a cor de fundo do rótulo é derivada de
     * `theme.palette.colorBackground` do tema ou no estilo `backgroundColor`.
     */
    +variant: 'filled' | 'outlined' | 'default',
    /**
     * Se verdadeiro, o usuário não poderá interagir com o componente
     */
    +disabled?: boolean,
    /**
     * Se verdadeiro, o usuário poderá interagir com o componente
     * @optional
     */
    editable?: boolean,
    /**
     * O texto a ser utilizado como placeholder
     */
    +label: string,
    /**
     * Placeholder for the input.
     */
    +placeholder?: ?string,
    /**
     * Se verdadeiro, estiliza o componente com cores e estilo de `error`
     */
    +error?: boolean,
    /**
     * Helper text a ser exibido,
     * Pode ser utilizado para exibir algum texto de ajuda para o `TextField`
     * ou para exibir uma mensagem de erro
     */
    +helperText?: ?string,
    /**
     * Função `callback` que é chamada quando o texto do TextField é alterado
     * O texto é enviado a função como argumento `(value: string) => mixed`
     */
    +onChangeText: (value: string) => mixed,
    /**
     * Cor de seleção do TextFiel
     * Utiliza por padrão a cor `theme.pallete.colorAccent`
     */
    +selectionColor?: ?string,
    /**
     * Cor do sublinhado do TextField
     * Utiliza por padrão a cor `theme.pallete.colorAccent`
     */
    +underlineColor?: ?string,
    /**
     * Se verdadeiro, o TextField suportará várias linhas
     */
    +multiline?: boolean,
    /**
     * Número de linhas a serem mostradas
     * Funciona apenas no Android
     */
    +numberOfLines?: number,
    /**
     * Chamada callback para quando o TextField estiver focado
     */
    +onFocus?: () => mixed,
    /**
     * Chamada callback para quando o TextField estiver desfocado
     */
    +onBlur?: () => mixed,
    /**
     * Valor do TextField
     */
    +value: string,
    /**
     * Objeto de estilos CSS
     */
    +style?: any,
    /**
     * Retorno de chamada para renderizar um componente de entrada personalizado,
     * como `react-native-text-input-mask` em vez do
     * componente padrão `TextInput` de` react-native`.
     */
    +render?: (props: RenderProps) => Node,
    /**
     * É possível posicionar ícones dentro do `TextField`
     * com suporte a ação
     */
    +adornments?: ?Adornments,
    /**
     * @optional
     */
    isDropdown: boolean,
    /**
     * @optional
     */
    focus: boolean,
    /**
     * @optional
     * Utilizado apenas internamente
     */
    +theme: ThemeDefault
};

type State = {
    labeled: Animated.Value,
    error: Animated.Value,
    focused: boolean,
    placeholder: ?string,
    value: ?string,
    labelLayout: {
        measured: boolean,
        width: number
    }
};

const AnimatedTypography = Animated.createAnimatedComponent(Text);

const MINIMIZED_LABEL_Y_OFFSET = -12;
const OUTLINE_MINIMIZED_LABEL_Y_OFFSET = -29;
const MAXIMIZED_LABEL_FONT_SIZE = 16;
const MINIMIZED_LABEL_FONT_SIZE = 12;
const LABEL_WIGGLE_X_OFFSET = 4;
const FOCUS_ANIMATION_DURATION = 150;
const BLUR_ANIMATION_DURATION = 180;
const LABEL_PADDING_HORIZONTAL = 12;
const RANDOM_VALUE_TO_CENTER_LABEL = 4;

const styles = StyleSheet.create({
    placeholder: {
        position: 'absolute',
        left: 0,
        fontSize: 16,
        paddingHorizontal: LABEL_PADDING_HORIZONTAL
    },
    placeholderFlat: {
        top: 19
    },
    placeholderOutlined: {
        top: 25
    },
    underline: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: 2
    },
    outline: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 6,
        bottom: 0
    },
    outlinedLabelBackground: {
        position: 'absolute',
        top: 0,
        left: 8,
        paddingHorizontal: 4,
        color: 'transparent'
    },
    input: {
        flex: 1,
        fontSize: 16,
        margin: 0,
        minHeight: 58,
        textAlign: I18nManager.isRTL ? 'right' : 'left',
        zIndex: 1
    },
    inputOutlined: {
        paddingTop: 20,
        paddingBottom: 16,
        minHeight: 64
    },
    inputFlatWithLabel: {
        paddingTop: 24,
        paddingBottom: 6
    },
    inputFlatWithoutLabel: {
        paddingVertical: 15
    },
    helperText: {
        width: '100%',
        paddingVertical: 4
    },
    containerInput: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    containerIconAdorment: {
        width: 48,
        height: 48,
        padding: 12
    }
});

class TextField extends PureComponent<Props, State> {
    static defaultProps = {
        disabled: false,
        error: false,
        helperText: null,
        multiline: false,
        placeholder: null,
        editable: true,
        selectionColor: null,
        underlineColor: null,
        numberOfLines: 1,
        onFocus: () => null,
        onBlur: () => null,
        style: {},
        focus: false,
        isDropdown: false,
        adornments: null,
        // eslint-disable-next-line arrow-parens
        render: (props: any) => <NativeTextInput {...props} />
    };

    static getDerivedStateFromProps(nextProps: Props, prevState: State) {
        return {
            value:
                nextProps.value !== 'undefined'
                    ? nextProps.value
                    : prevState.value,
            ...(nextProps.isDropdown ? { focused: nextProps.focus } : null)
        };
    }

    timer: TimeoutID;

    root: ?NativeTextInput;

    constructor(props: Props) {
        super(props);

        this.state = {
            labeled: new Animated.Value(props.value || props.error ? 0 : 1),
            error: new Animated.Value(props.error ? 1 : 0),
            focused: props.focus,
            // eslint-disable-next-line react/no-unused-state
            placeholder: props.error ? props.placeholder : '',
            value: props.value,
            labelLayout: {
                measured: false,
                width: 0
            }
        };
    }

    componentDidUpdate(prevProps: Props, prevState: State) {
        const { error, label } = this.props;
        const { focused, value } = this.state;

        if (
            prevState.focused !== focused ||
            prevState.value !== value ||
            prevProps.error !== error
        ) {
            /**
             * O rótulo deve ser minimizado se a entrada estiver focada
             * No modo minimizado o rótulo sobe e fica pequeno
             */
            if (value || focused || error) {
                this.minmizeLabel();
            } else {
                this.restoreLabel();
            }
        }

        if (
            prevState.focused !== focused ||
            prevProps.label !== label ||
            prevProps.error !== error
        ) {
            /**
             * Mostrar o texto de espaço reservado apenas se a entrada estiver focalizada ou não existir um rótulo
             * Não mostra espaço reservado se houver um rótulo, pois o rótulo serve como marcador de posição
             * Quando focado, o rótulo sobe, para que possamos mostrar um espaço reservado
             */
            if (focused || error || !label) {
                this.showPlaceholder();
            } else {
                this.hidePlaceholder();
            }
        }

        if (prevProps.error !== error) {
            // When the input has an error, we wiggle the label and apply error styles
            if (error) {
                this.showError();
            } else {
                this.hideError();
            }
        }
    }

    componentWillUnmount() {
        clearTimeout(this.timer);
    }

    showPlaceholder = () => {
        clearTimeout(this.timer);

        const { placeholder } = this.props;

        /**
         * Defina o alocador de espaço em um atraso para compensar a animação nativa do rótulo
         * Se mostrador de forma imediata, eles irão se sobrepor
         */
        this.timer = setTimeout(() => this.setState({ placeholder }), 50);
    };

    hidePlaceholder = () => this.setState({ placeholder: '' });

    showError = () => {
        const { error } = this.state;

        Animated.timing(error, {
            toValue: 1,
            duration: FOCUS_ANIMATION_DURATION,
            useNativeDriver: true
        }).start(this.showPlaceholder);
    };

    hideError = () => {
        const { error } = this.state;

        Animated.timing(error, {
            toValue: 0,
            duration: BLUR_ANIMATION_DURATION,
            useNativeDriver: true
        }).start();
    };

    restoreLabel = () => {
        const { labeled } = this.state;

        Animated.timing(labeled, {
            toValue: 1,
            duration: FOCUS_ANIMATION_DURATION,
            useNativeDriver: true
        }).start();
    };

    minmizeLabel = () => {
        const { labeled } = this.state;

        Animated.timing(labeled, {
            toValue: 0,
            duration: BLUR_ANIMATION_DURATION,
            useNativeDriver: true
        }).start();
    };

    handleFocus = (...args) => {
        const { disabled, onFocus } = this.props;

        if (disabled) {
            return;
        }

        this.setState({ focused: true });

        if (onFocus) {
            onFocus(...args);
        }
    };

    handleBlur = (...args) => {
        const { disabled, onBlur } = this.props;

        if (disabled) {
            return;
        }

        this.setState({ focused: false });

        if (onBlur) {
            onBlur(...args);
        }
    };

    handleChangeText = (value: string) => {
        const { editable, onChangeText } = this.props;

        if (!editable) {
            return;
        }

        this.setState({ value });

        if (onChangeText) {
            onChangeText(value);
        }
    };

    /**
     * @internal
     */
    setNativeProps(...args) {
        return this.root && this.root.setNativeProps(...args);
    }

    /**
     * Retorna `true` se a entrada está atualmente focada,
     * `false` caso contrário
     */
    isFocused() {
        return this.root && this.root.isFocused();
    }

    /**
     *Remove todos os valores digitados no TextField.
     */
    clear() {
        return this.root && this.root.clear();
    }

    /**
     * Foca a entrada
     */
    focus() {
        return this.root && this.root.focus();
    }

    /**
     * Remove o foco da entrada
     */
    blur() {
        return this.root && this.root.blur();
    }

    /**
     * Ação do adorno
     */
    onPressAdornments = () => {
        const { adornments } = this.props;

        // $FlowFixMe
        if (adornments.onPress) {
            adornments.onPress();
        }
    };

    render() {
        const {
            variant,
            disabled,
            label,
            error,
            helperText,
            selectionColor,
            underlineColor,
            style,
            theme,
            multiline,
            render,
            adornments,
            ...rest
        } = this.props;

        const { focused, labelLayout, value, labeled } = this.state;

        const hasActiveOutline = focused || error;
        const { backgroundColor = theme.palette.colorBackground } =
            StyleSheet.flatten(style) || {};

        let inputTextColor;

        let activeColor;

        let underlineColorCustom;

        let outlineColor;

        let placeholderColor;

        let containerStyle;

        if (disabled) {
            inputTextColor = theme.palette.textColorSecondary;
            activeColor = theme.palette.textColorSecondary;
            placeholderColor = theme.palette.textColorTertiary;
            outlineColor = theme.palette.textColorTertiary;
            underlineColorCustom = 'transparent';
        } else {
            inputTextColor = theme.palette.textColorPrimary;
            activeColor = error
                ? theme.palette.textColorError
                : theme.palette.colorAccent;
            placeholderColor = theme.palette.textColorSecondary;
            outlineColor = theme.palette.textColorSecondary;
            underlineColorCustom =
                underlineColor || theme.palette.textColorTertiary;
        }

        if (variant === 'default') {
            containerStyle = {
                backgroundColor: 'transparent'
            };
        }

        if (variant === 'filled') {
            containerStyle = {
                backgroundColor: color(theme.palette.colorBackground).isDark()
                    ? color(Colors.white[1000])
                          .alpha(0.24)
                          .toString()
                    : color(Colors.black[1000])
                          .alpha(0.06)
                          .toString(),
                borderTopLeftRadius: 4,
                borderTopRightRadius: 4
            };
        }

        const labelHalfWidth = labelLayout.width / 2;
        const baseLabelTranslateX =
            (I18nManager.isRTL ? 1 : -1) *
            (1 - MINIMIZED_LABEL_FONT_SIZE / MAXIMIZED_LABEL_FONT_SIZE) *
            labelHalfWidth;

        const labelStyle = {
            fontFamily: theme.palette.fontFamily,
            fontWeight: '400',
            letterSpacing: 0.15,
            fontSize: MAXIMIZED_LABEL_FONT_SIZE,
            transform: [
                {
                    // Mova o marcador quando tiver error
                    // eslint-disable-next-line react/destructuring-assignment
                    translateX: this.state.error.interpolate({
                        inputRange: [0, 0.5, 1],
                        outputRange: [
                            0,
                            value && error ? LABEL_WIGGLE_X_OFFSET : 0,
                            0
                        ]
                    })
                },
                {
                    // Move o rótulo para o topo
                    translateY: labeled.interpolate({
                        inputRange: [0, 1],
                        outputRange: [
                            variant === 'outlined'
                                ? OUTLINE_MINIMIZED_LABEL_Y_OFFSET
                                : MINIMIZED_LABEL_Y_OFFSET,
                            0
                        ]
                    })
                },
                {
                    // Torna o rótulo menor
                    scale: labeled.interpolate({
                        inputRange: [0, 1],
                        outputRange: [
                            MINIMIZED_LABEL_FONT_SIZE /
                                MAXIMIZED_LABEL_FONT_SIZE,
                            1
                        ]
                    })
                },
                {
                    translateX: labeled.interpolate({
                        inputRange: [0, 1],
                        outputRange: [
                            baseLabelTranslateX > 0
                                ? baseLabelTranslateX +
                                  labelHalfWidth /
                                      (variant === 'default'
                                          ? 4.5
                                          : LABEL_PADDING_HORIZONTAL) -
                                  RANDOM_VALUE_TO_CENTER_LABEL
                                : baseLabelTranslateX -
                                  labelHalfWidth /
                                      (variant === 'default'
                                          ? 4.5
                                          : LABEL_PADDING_HORIZONTAL) +
                                  RANDOM_VALUE_TO_CENTER_LABEL,
                            0
                        ]
                    })
                }
            ]
        };

        let adornmentsProps: Adornments = {};
        let renderWithIcon = false;
        let iconProps = {
            size: 24,
            name: '',
            color: ''
        };

        if (!isEmpty(adornments)) {
            adornmentsProps = {
                // $FlowFixMe
                iconName: adornments.iconName,
                iconColor: color(theme.palette.colorBackground).isDark()
                    ? theme.palette.textColorSecondary
                    : Colors.black[1000],
                // $FlowFixMe
                rippleColor: adornments.rippleColor,
                // $FlowFixMe
                rippleContainerRadius: adornments.rippleContainerRadius,
                // $FlowFixMe
                disabled: adornments.disabled,
                onPress: this.onPressAdornments
            };

            // $FlowFixMe
            if (!adornments.onPress) {
                renderWithIcon = true;

                iconProps = {
                    size: 24,
                    // $FlowFixMe
                    name: adornments.iconName,
                    color: color(theme.palette.colorBackground).isDark()
                        ? theme.palette.textColorSecondary
                        : Colors.black[1000]
                };
            }
        }

        return (
            <React.Fragment>
                <View style={[containerStyle, style]}>
                    {variant === 'outlined' ? (
                        /**
                         * Renderize o esboço separadamente do container
                         * isso é para que o rótulo possa se sobrepor ao contorno
                         * Caso contrário, a borda cortara o marcador no Android
                         */
                        <View
                            pointerEvents="none"
                            style={[
                                styles.outline,
                                {
                                    borderRadius: 4,
                                    borderWidth: hasActiveOutline ? 2 : 1,
                                    borderColor: hasActiveOutline
                                        ? activeColor
                                        : outlineColor
                                }
                            ]}
                        />
                    ) : null}
                    {variant === 'outlined' && label ? (
                        /**
                         * Quando o modo `outlined` é selecionado, a etiqueta de entrada
                         * fica no topo do contorno, o fundo do rótulo cobre o contorno para
                         * que pareça cortado, para conseguir esse efeito, o rótulo é posionado
                         * com um fundo acima dele, assim a cor do texto é definida para trasparente
                         * e então apenas o plano de fundo é visível
                         */
                        <AnimatedTypography
                            pointerEvents="none"
                            numberOfLines={1}
                            style={[
                                styles.outlinedLabelBackground,
                                {
                                    backgroundColor,
                                    fontFamily: theme.palette.fontFamily,
                                    fontWeight: '400',
                                    letterSpacing: 0.4,
                                    fontSize: MINIMIZED_LABEL_FONT_SIZE,
                                    /**
                                     * Esconda o fundo quando a escala for 0
                                     */
                                    opacity: labeled.interpolate({
                                        inputRange: [0, 0.9, 1],
                                        outputRange: [1, 1, 0]
                                    }),
                                    transform: [
                                        {
                                            // Animar a escala quando o marcador é movido para cima
                                            scaleX: labeled.interpolate({
                                                inputRange: [0, 1],
                                                outputRange: [1, 0]
                                            })
                                        }
                                    ]
                                }
                            ]}
                        >
                            {label}
                        </AnimatedTypography>
                    ) : null}

                    {variant === 'filled' || variant === 'default' ? (
                        // Nestes modos é renderizado o sublinhado
                        <Animated.View
                            style={[
                                styles.underline,
                                {
                                    backgroundColor: error
                                        ? theme.palette.textColorError
                                        : focused
                                            ? activeColor
                                            : underlineColorCustom,
                                    // O sublinhado é mais fino quando a entrada não está focada
                                    transform: [{ scaleY: focused ? 1 : 0.5 }]
                                }
                            ]}
                        />
                    ) : null}

                    {label ? (
                        /**
                         * Posicione o espaço reservado colorido e o espaço reservado
                         * cinza em cima eum do outro e cruze-os
                         * Isso permite o efeito de animar a cor e também de usar o
                         * driver nativo
                         */
                        <View
                            pointerEvents="none"
                            style={[
                                StyleSheet.absoluteFill,
                                {
                                    opacity:
                                        // Ocultar o rótulo no estado minimizado até medirmos a largura
                                        value || focused
                                            ? labelLayout.measured
                                                ? 1
                                                : 0
                                            : 1
                                }
                            ]}
                        >
                            <AnimatedTypography
                                numberOfLines={1}
                                // eslint-disable-next-line prettier/prettier
                            onLayout={e => this.setState({
                                        labelLayout: {
                                            width: e.nativeEvent.layout.width,
                                            measured: true
                                        }
                                    })
                                }
                                style={[
                                    styles.placeholder,
                                    variant === 'outlined'
                                        ? styles.placeholderOutlined
                                        : styles.placeholderFlat,
                                    labelStyle,
                                    {
                                        paddingLeft:
                                            variant === 'default' ? 0 : 12,
                                        color: activeColor,
                                        opacity: labeled.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [
                                                hasActiveOutline ? 1 : 0,
                                                0
                                            ]
                                        })
                                    }
                                ]}
                            >
                                {label}
                            </AnimatedTypography>
                            <AnimatedTypography
                                numberOfLines={1}
                                style={[
                                    styles.placeholder,
                                    variant === 'outlined'
                                        ? styles.placeholderOutlined
                                        : styles.placeholderFlat,
                                    labelStyle,
                                    {
                                        paddingLeft:
                                            variant === 'default' ? 0 : 12,
                                        color: placeholderColor,
                                        opacity: hasActiveOutline ? labeled : 1
                                    }
                                ]}
                            >
                                {label}
                            </AnimatedTypography>
                        </View>
                    ) : null}
                    <View style={styles.containerInput}>
                        {// $FlowFixMe
                        render({
                            ...rest,
                            ref: (c) => (this.root = c),
                            onChangeText: this.handleChangeText,
                            placeholder: label
                                ? this.state.placeholder
                                : this.props.placeholder,
                            placeholderTextColor: placeholderColor,
                            editable: !disabled,
                            selectionColor:
                                theme.palette.textColorSecondary ||
                                selectionColor,
                            onFocus: this.handleFocus,
                            onBlur: this.handleBlur,
                            underlineColorAndroid: 'transparent',

                            multiline,
                            style: [
                                styles.input,
                                variant === 'outlined'
                                    ? styles.inputOutlined
                                    : this.props.label
                                        ? styles.inputFlatWithLabel
                                        : styles.inputFlatWithoutLabel,
                                {
                                    paddingHorizontal:
                                        variant === 'default' ? 0 : 12,
                                    paddingRight: !error ? 0 : 12,
                                    color: inputTextColor,
                                    fontFamily: theme.palette.fontFamily,
                                    textAlignVertical: multiline
                                        ? 'top'
                                        : 'center',
                                    fontWeight: '400',
                                    fontSize: 16,
                                    letterSpacing: 0.15
                                }
                            ]
                        })}
                        {!isEmpty(adornments) ? (
                            <View style={{ paddingRight: 4, paddingTop: 4 }}>
                                {renderWithIcon ? (
                                    <View style={styles.containerIconAdorment}>
                                        <Icon {...iconProps} />
                                    </View>
                                ) : (
                                    <ToggleButton
                                        {...adornmentsProps}
                                        onPress={this.onPressAdornments}
                                    />
                                )}
                            </View>
                        ) : null}
                    </View>
                </View>
                {helperText ? (
                    <View
                        style={[
                            styles.helperText,
                            {
                                paddingHorizontal:
                                    variant === 'default' ? 0 : 12
                            }
                        ]}
                    >
                        <Typography
                            variant="caption"
                            color={error ? 'error' : 'secondary'}
                        >
                            {helperText}
                        </Typography>
                    </View>
                ) : null}
            </React.Fragment>
        );
    }
}

TextField.propTypes = {
    /**
     * Variante do TextField
     * - `filled` - entrada plana com sublinhado e background de destaque
     * - `outlined` - entrada com destaque em esboço
     * - `default` - entrada plana com background transparente
     *
     * No modo `outlined`, a cor de fundo do rótulo é derivada de
     * `theme.palette.colorBackground` do tema ou no estilo `backgroundColor`.
     */
    variant: PropTypes.oneOf(['filled', 'outlined', 'default']).isRequired,
    /**
     * Se verdadeiro, o usuário não poderá interagir com o componente
     */
    disabled: PropTypes.bool,
    /**
     * Se verdadeiro, o usuário poderá inserir texto no TextField
     */
    editable: PropTypes.bool,
    /**
     * O texto a ser utilizado como placeholder
     */
    label: PropTypes.string.isRequired,
    /**
     * Placeholder for the input.
     */
    placeholder: PropTypes.string,
    /**
     * Se verdadeiro, estiliza o componente com cores e estilo de `error`
     */
    error: PropTypes.bool,
    /**
     * Helper text a ser exibido,
     * Pode ser utilizado para exibir algum texto de ajuda para o `TextField`
     * ou para exibir uma mensagem de erro
     */
    helperText: PropTypes.string,
    /**
     * Função `callback` que é chamada quando o texto do TextField é alterado
     * O texto é enviado a função como argumento `(value: string) => mixed`
     */
    onChangeText: PropTypes.func.isRequired,
    /**
     * Cor de seleção do TextFiel
     * Utiliza por padrão a cor `theme.pallete.colorAccent`
     */
    selectionColor: PropTypes.string,
    /**
     * Cor do sublinhado do TextField
     * Utiliza por padrão a cor `theme.pallete.colorAccent`
     */
    underlineColor: PropTypes.string,
    /**
     * Se verdadeiro, o TextField suportará várias linhas
     */
    multiline: PropTypes.bool,
    /**
     * Número de linhas a serem mostradas
     * Funciona apenas no Android
     */
    numberOfLines: PropTypes.number,
    /**
     * Chamada callback para quando o TextField estiver focado
     */
    onFocus: PropTypes.func,
    /**
     * Chamada callback para quando o TextField estiver desfocado
     */
    onBlur: PropTypes.func,
    /**
     * Valor do TextField
     */
    value: PropTypes.string.isRequired,
    /**
     * Objeto de estilos CSS
     */
    style: PropTypes.any,
    /**
     * Retorno de chamada para renderizar um componente de entrada personalizado,
     * como `react-native-text-input-mask` em vez do
     * componente padrão `TextInput` de` react-native`.
     */
    render: PropTypes.func,
    /**
     * Controla as cores de focus
     */
    focus: PropTypes.bool,
    /**
     * Altera os controles de focus caso seja Dropdown
     */
    isDropdown: PropTypes.bool,
    /**
     * É possível posicionar ícones dentro do `TextField`
     * com suporte a ação
     */
    adornments: PropTypes.shape({
        /**
         * O nome do icone
         */
        iconName: PropTypes.string.isRequired,
        /**
         * A cor do ícone
         */
        iconColor: PropTypes.string,
        /**
         * A cor do efeito `Ripple`
         */
        rippleColor: PropTypes.string,
        /**
         * O arredondamento das bordas do efeito Ripple
         */
        rippleContainerRadius: PropTypes.number,
        /**
         * Se a ação esta desabilitada
         */
        disabled: PropTypes.bool,
        /**
         * Função chamada ao pressionar o ícone
         */
        onPress: PropTypes.func
    })
};

export default withTheme(TextField);
