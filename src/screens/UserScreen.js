import React from 'react';
import {Text, View, StyleSheet, Button, FlatList} from 'react-native';
import MsalPlugin, {MsalUIBehavior} from "react-native-msal-plugin";
import { NavigationEvents } from 'react-navigation';
import jwt_decode from 'jwt-decode';

const authority = "https://ltornyib2ctenant.b2clogin.com/tfp/ltornyib2ctenant.onmicrosoft.com";
const applicationId = "f17d0cb3-cc66-45e0-85a5-8517ece7a9b0";
const policies = {
  signUpSignInPolicy: "B2C_1_signupsignin1",
  passwordResetPolicy: "B2C_1_passwordreset1",
}
const scopes = ["https://ltornyib2ctenant.onmicrosoft.com/mobile/user_impersonation"];

const styles = StyleSheet.create({
    errorText: {
        borderColor: "red",
        borderWidth: 1,
        borderStyle: "solid"
    },
    tokenKeyText: {
        borderColor: "#6c757d",
        borderWidth: 1,
        borderStyle: "solid",
        padding: 5,
        textAlign: 'center',
        width: 60
    },
    tokenValueText: {
        borderColor: "#6c757d",
        borderWidth: 1,
        borderStyle: "solid",
        padding: 5,
        textAlign: 'center',
        width: 200
    }
});

export default class UserScreen extends React.Component {
    static navigationOptions = {
        title: 'User',
    };

    constructor(props) {
        super(props);
        this.msalPlugin = new MsalPlugin(authority, applicationId, policies);
        this.state = {
            loggedIn: false,
            authResult: {},
            hasError: false,
            errorMsg: ''
        }
        /* this.state.authResult.accessToken
                                .userInfo
                                .uniqueId
                                .idToken
                                .authority
                                .expiresOn */
    }

    keyExtractor(item, index) {
        return index.toString();
    }

    renderIdTokenItem(item) {
        return (
        <View style={{flexDirection: 'row', justifyContent: 'center', flexWrap: 'nowrap'}}>
            <Text style={styles.tokenKeyText}>{item[0]}</Text>
            <Text style={styles.tokenValueText}>{item[1]}</Text>
        </View>
        );
    }

    render() {
        let idTokenArray;
        if (this.state.loggedIn) {
            const idTokenDecoded = jwt_decode(this.state.authResult.idToken);
            idTokenArray = Object.entries(idTokenDecoded);
        }
        return (
        <View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
            <NavigationEvents onWillFocus={payload => this.willFocus(payload)} />
            {!this.state.loggedIn && (<View>
                                      <Text>Not logged in</Text>
                                      <Button onPress={() => this.doLogin()} title="Log in" />
                                      </View>)}
            {this.state.hasError && (<Text style={styles.errorText}>{this.state.errorMsg}</Text>)}
            {this.state.loggedIn && (<View style={{marginTop: 50}}>
                                     <Text style={{textAlign: 'center'}}>Claims</Text>
                                     <FlatList
                                        data={idTokenArray}
                                        renderItem={({item}) => this.renderIdTokenItem(item)}
                                        keyExtractor={this.keyExtractor}
                                     />
                                     <Button onPress={() => this.doLogout()} title="Logout" />
                                     </View>)}
        </View>
        );
    }

    willFocus() {
        if (this.state.loggedIn == false) {
            this.doLogin();
        }
    }

    async doLogin() {
        try {
            const result = await this.msalPlugin.acquireTokenAsync(
                scopes,
                {},
                "",
                MsalUIBehavior.SELECT_ACCOUNT,
            );
            this.setState({
                hasError: false,
                loggedIn: true,
                authResult: result
            });
        } catch (error) {
            console.log('Login error');
            console.log(error);
            // console.log(error.userInfo.MSALErrorDescriptionKey);
            console.log(error.code);
            this.handleError(error);
        }
    }

    async doLogout() {
        try {
            await this.msalPlugin.tokenCacheDelete();
            this.setState({
                hasError: false,
                loggedIn: false,
                authenticationResult: {}
            });
        } catch(error) {
            console.log('Logout error');
            console.log(error);
            this.handleError(error);
        }
    }

    handleError(e) {
        let msg;
        switch (e.code) {
            case 'EUNSPECIFIED':
            case '-42104': msg = 'User cancelled signup or password reset'; break;
            case 'userCancel':
            case '-42400': msg = 'User cancelled the authorization session'; break;
            case '-42500': msg = 'Authentication response received without expected accessToken'; break;
            default: msg = 'Unknow error, code:' + e.code;
        }
        this.setState({
            hasError: true,
            errorMsg: msg
        });
    }
}
