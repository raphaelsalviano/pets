/* @flow */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import LinearProgressBar from './LinearProgressBar';
import CircularProgressBar from './CircularProgressBar';

type Props = {
    +variant?: 'linear' | 'circular',
    +animated?: boolean,
    +color?: ?string,
    +indeterminate?: boolean,
    +progress?: number,
    +children?: any
};

class ProgressIndicator extends PureComponent<Props> {
    static defaultProps = {
        variant: 'linear',
        animated: true,
        color: null,
        indeterminate: true,
        progress: 0,
        children: null
    };

    render() {
        const {
            variant,
            animated,
            color,
            indeterminate,
            progress,
            children
        } = this.props;

        if (variant === 'linear') {
            const linearProps = {
                animated,
                color,
                indeterminate,
                progress
            };

            return (
                <LinearProgressBar {...linearProps}>
                    {children}
                </LinearProgressBar>
            );
        }

        const circularProps = {
            color
        };

        return <CircularProgressBar {...circularProps} />;
    }
}

ProgressIndicator.propTypes = {
    /**
     * Define a variante do progressIndicator
     */
    variant: PropTypes.oneOf(['linear', 'circular']),
    /**
     * Configura o progressIndicator para ser animado
     * Apenas para variante 'linear'
     */
    animated: PropTypes.bool,
    /**
     * Configura a cor do componente
     * Por padrão utiliza a cor do tema
     */
    color: PropTypes.string,
    /**
     * Configura se o progressIndicator é do tipo indeterminado
     * Para a variante 'circular' sempres erá indeterminado
     * Configurável apenas na variante 'linear'
     */
    indeterminate: PropTypes.bool,
    /**
     * Configura o progresso da barra
     * Apenas para a variante 'linear'
     */
    progress: PropTypes.number,
    /**
     * Qualquer coisa a ser renderizada junto com o progressIndicator
     * Apenas para a variante 'linear'
     */
    children: PropTypes.node
};

export default ProgressIndicator;
