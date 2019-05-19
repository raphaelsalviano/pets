/* @flow */

import * as React from 'react';

export interface RenderProps {
    ref: (value: any) => void,
    onChangeText: (value: string) => void,
    placeholder: string | null | undefined,
    placeholderTextColor: string,
    editable?: boolean,
    selectionColor: string,
    onFocus: Function,
    onBlur: Function,
    underlineColorAndroid: string,
    style: any,
    multiline?: boolean,
    numberOfLines?: number,
    value?: string
}

export interface Adornments {
    /**
     * O nome do icone
     */
    iconName: string,
    /**
     * A cor do ícone
     */
    iconColor?: string,
    /**
     * A cor do efeito `Ripple`
     */
    rippleColor?: string,
    /**
     * O arredondamento das bordas do efeito Ripple
     */
    rippleContainerRadius?: number,
    /**
     * Se a ação esta desabilitada
     */
    disabled?: boolean,
    /**
     * Função chamada ao pressionar o ícone
     */
    onPress?: Function
}

export interface TextFieldProps {
    /**
     * Variante do TextField
     * - `filled` - entrada plana com sublinhado e background de destaque
     * - `outlined` - entrada com destaque em esboço
     * - `default` - entrada plana com background transparente
     *
     * No modo `outlined`, a cor de fundo do rótulo é derivada de
     * `theme.palette.colorBackground` do tema ou no estilo `backgroundColor`.
     */
    variant: 'filled' | 'outlined' | 'default',
    /**
     * Se verdadeiro, o usuário não poderá interagir com o componente
     */
    disabled?: boolean,
    /**
     * Se verdadeiro, o usuário poderá interagir com o componente
     * @optional
     */
    editable?: boolean,
    /**
     * O texto a ser utilizado como placeholder
     */
    label: string,
    /**
     * Placeholder for the input.
     */
    placeholder?: string,
    /**
     * Se verdadeiro, estiliza o componente com cores e estilo de `error`
     */
    error?: boolean,
    /**
     * Função `callback` que é chamada quando o texto do TextField é alterado
     * O texto é enviado a função como argumento `(value: string) => mixed`
     */
    onChangeText: Function,
    /**
     * Cor de seleção do TextFiel
     * Utiliza por padrão a cor `theme.pallete.colorAccent`
     */
    selectionColor?: string,
    /**
     * Cor do sublinhado do TextField
     * Utiliza por padrão a cor `theme.pallete.colorAccent`
     */
    underlineColor?: string,
    /**
     * Se verdadeiro, o TextField suportará várias linhas
     */
    multiline?: boolean,
    /**
     * Número de linhas a serem mostradas
     * Funciona apenas no Android
     */
    numberOfLines?: number,
    /**
     * Chamada callback para quando o TextField estiver focado
     */
    onFocus?:Function,
    /**
     * Chamada callback para quando o TextField estiver desfocado
     */
    onBlur?:Function,
    /**
     * Valor do TextField
     */
    value: string,
    /**
     * Objeto de estilos CSS
     */
    style?: any,
    /**
     * Retorno de chamada para renderizar um componente de entrada personalizado,
     * como `react-native-text-input-mask` em vez do
     * componente padrão `TextInput` de` react-native`.
     */
    render: (props: RenderProps) => any,
    /**
     * É possível posicionar ícones dentro do `TextField`
     * com suporte a ação
     */
    adornments?: Adornments
}

declare const TextField: React.ComponentType<TextFieldProps>;

export default TextField;