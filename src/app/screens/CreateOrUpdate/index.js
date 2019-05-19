/* @flow */

import React, { PureComponent } from 'react';

import { View, StyleSheet, FlatList, Image, Alert, ActivityIndicator } from 'react-native';

import { AppBar, Typography, Colors, ToggleButton, FloatingActionButton, Ripple, TextField, Button } from '../../components/material-design';

import PetsService from '../../services/PetsService';

const styles = StyleSheet.create({
    root: { flex: 1 },
    containerRoot: {
        flex: 1,
        padding: 16
    },
    containerItem: {
        width: '100%',
        paddingVertical: 8
    }
});

class CreateOrUpdate extends PureComponent<*> {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            petName: '',
            petRaca: ''
        };
    }

    componentDidMount() {
        const { params } = this.props.navigation.state;

        if (params && params.id && !params.add) {
            PetsService.fetchWithId(params.id).then((response) => {
                if (response) {
                    this.setState({
                        isLoading: false,
                        petName: response.name,
                        petRaca: response.raca
                    });
                }
            });
        } else {
            this.setState({
                isLoading: false
            });
        }
    }

    onLeftElementPress = () => {
        const { goBack } = this.props.navigation;

        goBack();
    };

    renderEdit = () => {
        const { params } = this.props.navigation.state;

        if (params && !params.edit && (params.add || params.view)) {
            return null;
        }

        const petNameProps = {
            variant: 'outlined',
            label: 'Nome',
            value: this.state.petName,
            onChangeText: (value) => this.setState({ petName: value }),
            keyboardType: 'default',
            helperText: 'Informe o nome do seu Pet'
        };

        const petRacaProps = {
            variant: 'outlined',
            label: 'Raça',
            value: this.state.petRaca,
            onChangeText: (value) => this.setState({ petRaca: value }),
            keyboardType: 'default',
            helperText: 'Informe a raça do seu Pet'
        };

        return (
            <View style={styles.containerRoot} >
                <View style={styles.containerItem}>
                    <TextField {...petNameProps} />
                </View>
                <View style={styles.containerItem}>
                    <TextField {...petRacaProps} />
                </View>
                <View stye={{ flex: 1 }} />
                <Button
                    onPress={() => this.onPressSave('edit')}
                    variant="contained"
                    children="Salvar"
                />
            </View>
        );
    };

    onPressSave = (type: 'add' | 'edit') => {
        const { state, goBack } = this.props.navigation;
        const { petName, petRaca } = this.state;

        if (type === 'add') {
            const pet = {
                name: petName,
                raca: petRaca
            };

            return PetsService.create(pet).then(() => goBack());
        }

        const pet = {
            _id: state.params.id,
            name: petName,
            raca: petRaca
        };

        return PetsService.updateAt(pet).then(() => goBack());
    };

    renderAdd = () => {
        const { params } = this.props.navigation.state;

        if (params && !params.add && (params.edit || params.view)) {
            return null;
        }

        const petNameProps = {
            variant: 'outlined',
            label: 'Nome',
            value: this.state.petName,
            onChangeText: (value) => this.setState({ petName: value }),
            keyboardType: 'default',
            helperText: 'Informe o nome do seu Pet'
        };

        const petRacaProps = {
            variant: 'outlined',
            label: 'Raça',
            value: this.state.petRaca,
            onChangeText: (value) => this.setState({ petRaca: value }),
            keyboardType: 'default',
            helperText: 'Informe a raça do seu Pet'
        };

        return (
            <View style={styles.containerRoot} >
                <View style={styles.containerItem}>
                    <TextField {...petNameProps} />
                </View>
                <View style={styles.containerItem}>
                    <TextField {...petRacaProps} />
                </View>
                <View stye={{ flex: 1 }} />
                <Button
                onPress={() => this.onPressSave('add')}
                    variant="contained"
                    children="Salvar"
                />
            </View>
        );
    };

    renderView = () => {
        const { params } = this.props.navigation.state;

        if (params && !params.view && (params.edit || params.add)) {
            return null;
        }

        return (
            <View style={styles.containerRoot} >
                <View style={styles.containerItem}>
                    <Typography variant="caption" color="secondary">
                        {'Nome'}
                    </Typography>
                    <Typography variant="subtitle2" gutterBottom={false}>
                        {this.state.petName}
                    </Typography>
                </View>
                <View style={styles.containerItem}>
                    <Typography variant="caption" color="secondary">
                        {'Raça'}
                    </Typography>
                    <Typography variant="subtitle2" gutterBottom={false}>
                        {this.state.petRaca}
                    </Typography>
                </View>
            </View>
        );
    };

    render() {
        const { isLoading } = this.state;

        console.log(this.props);

        const appBarProps = {
            leftElement: 'arrow-back',
            onLeftElementPress: this.onLeftElementPress,
            centerElement: 'Pet'
        };

        return(
            <View style={styles.root} >
                <AppBar {...appBarProps} />
                {isLoading ? (<ActivityIndicator animating size="large" />) : null}
                {this.renderView()}
                {this.renderEdit()}
                {this.renderAdd()}
            </View>
        );
    }

}

export default CreateOrUpdate;