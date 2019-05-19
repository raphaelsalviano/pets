/* @flow */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { StyleSheet, View } from 'react-native';

import { withTheme } from '../styles';

import Ripple from '../RippleEffect';
import TextField from '../TextField';

import DropdownMenu from './DropdownMenu';

import type { DropdownItemType } from './DropdownItem';
import type { LayoutEvent } from '../types/CoreEvents';
import type { ThemeDefault } from '../types/ThemeType';

type Props = {
    +variant: 'filled' | 'outlined' | 'default',
    +data: Array<?DropdownItemType>,
    +disabled?: boolean,
    +label: string,
    +error?: boolean,
    +helperText?: ?string,
    +value: ?DropdownItemType,
    +onChangeValue: (value: ?DropdownItemType) => mixed,
    /**
     * @optional
     */
    theme: ThemeDefault
};

type State = {
    value: ?DropdownItemType,
    focus: boolean,
    width: number,
    height: number
};

const styles = StyleSheet.create({
    itemMenu: {
        width: '100%',
        height: 1
    },
    containerMenu: {
        position: 'absolute',
        bottom: 26
    }
});

class Dropdown extends PureComponent<Props, State> {
    static defaultProps = {
        disabled: false,
        error: false,
        helperText: null
    };

    menu: any;

    textfield: any;

    constructor(props: Props) {
        super(props);

        this.state = {
            value: props.value,
            focus: false,
            width: 0,
            height: 0
        };
    }

    onChangeValue = () => {
        const { onChangeValue } = this.props;
        const { value } = this.state;

        if (onChangeValue) {
            onChangeValue(value);
        }
    };

    onPressItem = (item: ?DropdownItemType) => {
        if (item) {
            this.setState({ value: item });
        }

        // eslint-disable-next-line no-underscore-dangle
        this.setState({ focus: false });
    };

    onPress = () => {
        // eslint-disable-next-line no-underscore-dangle
        this.menu._root.show();
        this.setState({ focus: true });
    };

    getRefMenu = (menu: any) => {
        this.menu = menu;
    };

    getRefTextField = (textfield: any) => {
        this.textfield = textfield;
    };

    renderMenu = () => {
        const { data } = this.props;
        const { width, height } = this.state;

        const dropdownMenuProps = {
            ref: this.getRefMenu,
            buttonComponent: <View style={styles.itemMenu} />,
            menuItems: data,
            onClose: this.onPressItem,
            sizeCard: { width, height }
        };

        return <DropdownMenu {...dropdownMenuProps} />;
    };

    onTextFielLayout = (event: LayoutEvent) => {
        const { width, height } = event.nativeEvent.layout;

        this.setState({ width, height });
    };

    render() {
        const {
            variant,
            disabled,
            label,
            error,
            helperText,
            theme
        } = this.props;
        const { value, focus } = this.state;

        const rippleProps = {
            onPress: this.onPress,
            disabled
        };

        const textfieldProps = {
            ref: this.getRefTextField,
            variant,
            editable: false,
            focus,
            isDropdown: true,
            selectionColor: focus ? theme.palette.colorAccent : null,
            label,
            error,
            helperText,
            // eslint-disable-next-line no-nested-ternary
            value: value ? value.label : focus ? ' ' : '',
            onChangeText: () => null,
            numberOfLines: 1,
            adornments: {
                iconName: focus ? 'arrow-drop-up' : 'arrow-drop-down'
            }
        };

        return (
            <Ripple {...rippleProps}>
                <View onLayout={this.onTextFielLayout}>
                    <TextField {...textfieldProps} />
                    <View style={styles.containerMenu}>
                        {this.renderMenu()}
                    </View>
                </View>
            </Ripple>
        );
    }
}

Dropdown.propTypes = {
    variant: PropTypes.oneOf(['filled', 'outlined', 'default']).isRequired,
    data: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string,
            value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        })
    ).isRequired,
    disabled: PropTypes.bool,
    label: PropTypes.string.isRequired,
    error: PropTypes.bool,
    helperText: PropTypes.string,
    value: PropTypes.shape({
        label: PropTypes.string,
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    }).isRequired,
    onChangeValue: PropTypes.func.isRequired
};

export default withTheme(Dropdown);
