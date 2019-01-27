import React from 'react';
import {Text, View} from 'react-native';

export default class HomeScreen extends React.Component {
    static navigationOptions = {
        title: 'Home',
    };
    
    render() {
        return (
        <View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
            <Text>Home works!</Text>
        </View>
        );
    }
}
