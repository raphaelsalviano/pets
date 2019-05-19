/* @flow */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { StyleSheet } from 'react-native';

import Ripple from '../RippleEffect';
import Typography from '../Typography';

export type DropdownItemType = {
    +label: string,
    +value: string | number
};

type Props = {
    +item: DropdownItemType,
    +disabled?: boolean,
    +onSelected: (item: DropdownItemType) => mixed
};

const styles = StyleSheet.create({
    root: {
        width: '100%',
        height: 48,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingLeft: 16,
        paddingRight: 8
    }
});

class DropdownItem extends PureComponent<Props> {
    static defaultProps = {
        disabled: false
    };

    onSelected = () => {
        const { item, onSelected } = this.props;

        if (onSelected) {
            onSelected(item);
        }
    };

    render() {
        const { item, disabled } = this.props;

        const rippleProps = {
            style: styles.root,
            onPress: this.onSelected,
            disabled
        };

        const typographyProps = {
            variant: 'body2',
            gutterBottom: false,
            color: disabled ? 'tertiary' : 'primary'
        };

        return (
            <Ripple {...rippleProps}>
                <Typography {...typographyProps}>{item.label}</Typography>
            </Ripple>
        );
    }
}

DropdownItem.propTypes = {
    item: PropTypes.shape({
        label: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired
    }).isRequired,
    disabled: PropTypes.bool,
    onSelected: PropTypes.func.isRequired
};

export default DropdownItem;
