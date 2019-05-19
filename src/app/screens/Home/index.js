/* @flow */

import React, { PureComponent } from 'react';

import { View, StyleSheet, FlatList, Image, Alert } from 'react-native';

import { AppBar, Typography, Colors, ToggleButton, FloatingActionButton, Ripple } from '../../components/material-design';

import PetsService from '../../services/PetsService';

const styles = StyleSheet.create({
    root: { flex: 1 },
    containerItem: {
        width: '80%',
        height: 72,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: Colors.grey[300]
    },
    image: {
        width: 48,
        height: 48,
        borderRadius: 24,
        resizeMode: 'cover'
    }
});

class Home extends PureComponent<*> {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            pets: []
        };
    }

    componentDidMount() {
        PetsService.fetchAll().then((response) => {
            if (response) {
                this.setState({
                    isLoading: false,
                    pets: response
                });
            }
        });
    }

    onRefreshingReservas = () => {
        return PetsService.fetchAll().then((response) => {
            if (response) {
                this.setState({
                    isLoading: false,
                    pets: response
                });
            }
        });
    };

    onPressDelete = (id: string) => {
        Alert.alert(
            'Excluir Pet',
            'Tem certeza que deseja excluir este Pet?',
            [
                { text: 'Cancelar', onPress: () => null },
                { text: 'Excluir', onPress: () => this.onDelete(id) }
            ],
            { cancelable: false }
        );
    }

    onDelete = (id: string) => {
        return Promise.resolve()
            .then(() => PetsService.remove(id))
            .then(() => PetsService.fetchAll())
            .then((response) => {
                if (response) {
                    this.setState({
                        isLoading: false,
                        pets: response
                    });
                }
            }).catch(() => {
                alert('Um erro ocorreu ao tentar remover um Pet. Tente novamente mas tarde.');
            });
    };

    renderListEmptyComponent = () => (
        <View style={[styles.containerItem, { width: '100%' }]}>
            <Typography variant="h6" gutterBottom={false}>
                Nenhum Pet cadastrado
            </Typography>
        </View>
    );

    renderItem = ({item}) => (
        <View style={[styles.containerItem, { width: '100%' }]}>
            <Ripple 
                style={styles.containerItem}
                onPress={() => this.props.navigation.navigate('CreateOrUpdate', { id: item._id, edit: false, add: false, view: true })}>
                <Image 
                    source={require('../../../res/pet.png')} 
                    style={styles.image} />
                <View style={[styles.root, { paddingLeft: 16, alignItems: 'flex-start', justifyContent: 'center' }]}>
                    <Typography variant="subtitle2" gutterBottom={false}>{item.name}</Typography>
                    <Typography variant="caption" gutterBottom={false} color="secondary">{item.raca}</Typography>
                </View>
            </Ripple>
            <ToggleButton iconName="edit" onPress={() => this.props.navigation.navigate('CreateOrUpdate', { id: item._id, edit: true, add: false, view: false })} />
            <ToggleButton iconName="delete" onPress={() => this.onPressDelete(item._id)} />
        </View>
    );

    keyExtractor = (item, index) => index.toString();

    onPressAdd = () => {
        const { navigate } = this.props.navigation;

        navigate('CreateOrUpdate', { edit: false, id: null, add: true, view: false });
    };

    render() {

        const appBarProps = {
            centerElement: 'Pets'
        };

        const flatListProps = {
            data: this.state.pets,
            extraData: this.state,
            keyExtractor: (item) => item._id,
            ListEmptyComponent: this.renderListEmptyComponent,
            renderItem: this.renderItem,
            refreshing: this.state.isLoading,
            onRefresh: this.onRefreshingReservas
        };

        const floatingActionButtonProps = {
            colorButton: Colors.red[500],
            iconButton: 'add',
            iconColorButton: Colors.white[1000],
            position: 'right',
            onPress: this.onPressAdd
        };

        return(
            <View style={styles.root} >
                <AppBar {...appBarProps} />
                <FlatList {...flatListProps} />
                <FloatingActionButton {...floatingActionButtonProps} />
            </View>
        );
    }

}

export default Home;