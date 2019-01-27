import React from "react";
import Icon from 'react-native-vector-icons/FontAwesome5';
import { createBottomTabNavigator, createAppContainer } from "react-navigation";

import HomeScreen from './src/screens/HomeScreen';
import UserScreen from './src/screens/UserScreen';

// const AppNavigator = createStackNavigator(
const AppNavigator = createBottomTabNavigator(
  {
    Home: {
      screen: HomeScreen,
      navigationOptions: {
        tabBarLabel: 'Home',
        tabBarIcon: ({color}) =>
          <Icon name="home" size={25} color={color} />
      }
    } ,
    User: {screen: UserScreen,
      navigationOptions: {
        tabBarLabel: 'User',
        tabBarIcon: ({color}) =>
          <Icon name="user" size={25} color={color} />
      }
    }
  },
  {
    initialRouteName: "Home"
  }
);

const AppContainer = createAppContainer(AppNavigator);

export default class App extends React.Component {
  render() {
    return <AppContainer />;
  }
}
