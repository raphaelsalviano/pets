/* @flow */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { View, Image } from 'react-native';

import Icon from '../Icon';
import Typography from '../Typography';

type Props = {
    +variant: 'image' | 'text' | 'icon',
    +size?: number,
    +backgroundColor?: string,
    +imgProps?: {
        +uri?: string,
        +resource?: any
    },
    +textProps?: {
        +label: string,
        +color: string,
        +variant: string
    },
    +iconProps?: {
        +name: string,
        +color: string,
        +size: string
    }
};

class Avatar extends PureComponent<Props> {
    static defaultProps = {
        size: 40,
        imgProps: null,
        textProps: null,
        iconProps: null
    };

    render() {
        const {
            variant,
            size,
            backgroundColor,
            imgProps,
            textProps,
            iconProps
        } = this.props;

        let content = null;

        if (variant === 'image') {
            const style = {
                height: size,
                width: size,
                resizeMode: 'cover',
                // $FlowFixMe
                borderRadius: size / 2
            };

            // $FlowFixMe
            const source = imgProps.uri
                ? { uri: imgProps.uri } // $FlowFixMe
                : imgProps.resource;

            content = <Image style={style} source={source} />;
        }

        if (variant === 'text') {
            const style = {
                height: size,
                width: size,
                backgroundColor,
                // $FlowFixMe
                borderRadius: size / 2,
                // $FlowFixMe
                color: textProps.color
            };

            const typographyProps = {
                // $FlowFixMe
                variant: textProps.variant,
                gutterBottom: false
            };

            content = ( // $FlowFixMe
                <View style={style}>
                    <Typography {...typographyProps}>
                        {
                            // $FlowFixMe
                            textProps.label
                        }
                    </Typography>
                </View>
            );
        }

        if (variant === 'icon') {
            const style = {
                height: size,
                width: size,
                backgroundColor,
                // $FlowFixMe
                borderRadius: size / 2,
                // $FlowFixMe
                color: textProps.color
            };

            content = ( // $FlowFixMe
                <View style={style}>
                    <Icon {...iconProps} />
                </View>
            );
        }

        return content;
    }
}

Avatar.propTypes = {
    variant: PropTypes.oneOf(['image', 'text', 'icon']).isRequired,
    size: PropTypes.number,
    backgroundColor: PropTypes.string.isRequired,
    imgProps: PropTypes.shape({
        uri: PropTypes.string,
        resource: PropTypes.any
    }),
    textProps: PropTypes.shape({
        label: PropTypes.string.isRequired,
        color: PropTypes.string.isRequired,
        variant: PropTypes.string.isRequired
    }),
    iconProps: PropTypes.shape({
        name: PropTypes.string.isRequired,
        color: PropTypes.string.isRequired,
        size: PropTypes.string.isRequired
    })
};

export default Avatar;
