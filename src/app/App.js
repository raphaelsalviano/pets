/* @flow */

import React, {Component} from 'react';

import { MaterialThemeProvider } from './components/material-design'

import { createAppContainer, createStackNavigator } from 'react-navigation';

import Home from './screens/Home';
import CreateOrUpdate from './screens/CreateOrUpdate';

const Routes = {
  Home: { screen: Home },
  CreateOrUpdate: { screen: CreateOrUpdate }
};

const StackNavigator = createStackNavigator(Routes, {
  initialRouteName: 'Home',
  mode : 'card',
  headerMode : 'none'
});

export default class App extends Component<*> {
  render() {
    const Navigator = createAppContainer(StackNavigator);

    return (
      <MaterialThemeProvider>
        <Navigator />
      </MaterialThemeProvider>
    );
  }
}
