/* @flow */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { Text } from 'react-native';

import { withTheme } from '../styles';

import type { ThemeDefault } from '../types/ThemeType';

import type { TypographyStyle } from '../types/StylesTypes';

type Props = {
    +variant:
        | 'h1'
        | 'h2'
        | 'h3'
        | 'h4'
        | 'h5'
        | 'h6'
        | 'subtitle1'
        | 'subtitle2'
        | 'body1'
        | 'body2'
        | 'button'
        | 'caption'
        | 'overline',
    +color?: 'default' | 'error' | 'primary' | 'secondary' | 'tertiary',
    +gutterBottom?: boolean,
    +truncate?: boolean,
    +numberOfLines?: number,
    +styles?: TypographyStyle,
    +theme: ThemeDefault,
    +children: any
};

class Typography extends PureComponent<Props> {
    static defaultProps = {
        variant: 'body1',
        color: 'default',
        gutterBottom: true,
        truncate: true,
        numberOfLines: 1,
        styles: {}
    };

    render() {
        const {
            variant,
            color,
            gutterBottom,
            truncate,
            numberOfLines,
            styles,
            theme,
            children,
            ...rest
        } = this.props;

        const tempStyle: TypographyStyle = {
            ...(color === 'default' || color === 'primary'
                ? { color: theme.palette.textColorPrimary }
                : null),
            ...(color === 'secondary'
                ? { color: theme.palette.textColorSecondary }
                : null),
            ...(color === 'tertiary'
                ? { color: theme.palette.textColorTertiary }
                : null),
            ...(color === 'error'
                ? { color: theme.palette.textColorError }
                : null),
            ...(gutterBottom ? { paddingBottom: 6 } : null),
            fontFamily: theme.palette.fontFamily
        };

        const style: TypographyStyle = {
            ...theme.typography[variant],
            ...tempStyle,
            ...styles
        };

        const textProps = {
            numberOfLines,
            ...(truncate ? { ellipsizeMode: 'tail' } : null),
            ...rest
        };

        let text = children;

        if (variant === 'button' || variant === 'overline') {
            text = children.toUpperCase();
        }

        return (
            // $FlowFixMeProps
            <Text style={{ ...style }} {...textProps}>
                {text}
            </Text>
        );
    }
}

Typography.propTypes = {
    /**
     * Aplica os estilos de tipografia do tema
     * Requerido
     */
    variant: PropTypes.oneOf([
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'subtitle1',
        'subtitle2',
        'body1',
        'body2',
        'button',
        'caption',
        'overline'
    ]),
    /**
     * As cores padrão disponíveis para o componente
     * Default: default
     */
    color: PropTypes.oneOf([
        'default',
        'error',
        'primary',
        'secondary',
        'tertiary'
    ]),
    /**
     * Adiciona uma margem inferior ao texto
     * Default: true
     */
    gutterBottom: PropTypes.bool,
    /**
     * Se verdadeiro, o texto não será quebrado, mas truncado com reticências
     * Default: true
     */
    truncate: PropTypes.bool,
    /**
     * Número de linhas a serem exibidas no texto
     ** Default: true
     */
    numberOfLines: PropTypes.number,
    /**
     * Sobrescreva ou estenda os estilos aplicados ao componente.
     */
    styles: PropTypes.object
};

export default withTheme(Typography);
