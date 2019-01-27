import React from 'react';
import {Text, View, StyleSheet, Button, FlatList, TextInput} from 'react-native';
import MsalPlugin, {MsalUIBehavior} from "react-native-msal-plugin";
import { NavigationEvents } from 'react-navigation';
import jwt_decode from 'jwt-decode';

const authority = "https://ltornyib2ctenant.b2clogin.com/tfp/ltornyib2ctenant.onmicrosoft.com";
const applicationId = "f17d0cb3-cc66-45e0-85a5-8517ece7a9b0";
const policies = {
  signUpSignInPolicy: "B2C_1_signupsignin1",
  passwordResetPolicy: "B2C_1_passwordreset1",
}
const scopes = ["https://ltornyib2ctenant.onmicrosoft.com/backend/scope1"];

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

const apiEndpoint = 'https://ltornyi-funcapp.azurewebsites.net/api/greeting?code=VxsX0SoGDPZidwAgAr4AjzRtiWmNf/3QMbI2jCQnbUs9SSnO46eAvg==';

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
            errorMsg: '',
            textValue: ''
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
            try {
                const idTokenDecoded = jwt_decode(this.state.authResult.idToken);
                // const idTokenDecoded = jwt_decode(this.state.authResult.accessToken);
                idTokenArray = Object.entries(idTokenDecoded);
            } catch(e) {
                console.error('error decoding token');
                console.error(e);
            }
            
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
                                     <View style={{flexDirection: 'row'}}>
                                         <TextInput style={{width:150, borderBottomWidth: 1}}onChangeText={(txt) => this.handleTextChange(txt)} value={this.state.textValue}></TextInput>
                                         <Button onPress={this.handleAPICall} title="Call API"></Button>
                                     </View>
                                     <View style={{flexDirection: 'row'}}>
                                         <Text>Response:</Text>
                                         <Text>{this.state.apiResponse}</Text>
                                     </View>
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

    handleAPICall = async () => {
        try {
            await this.refreshToken();
            let response = await fetch(apiEndpoint, {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + this.state.authResult.accessToken
                },
                body: JSON.stringify({
                    name: this.state.textValue
                })
            });
            this.handleAPIResponse(response);
        } catch (error) {
            console.error('handleAPICall');
            console.error(error);
        }
    }

    handleAPIResponse(response) {
        this.setState({
            apiResponse: response.status + ':' + response._bodyText
        });
    }

    handleTextChange(txt) {
        this.setState({
            textValue: txt
        });
    }

    async refreshToken() {
        try {
            const result = await this.msalPlugin.acquireTokenSilentAsync(
                scopes,
                this.state.authResult.userInfo.userIdentifier
            );
            this.setState({
                authResult: result
            });
        } catch(e) {
            console.error('refreshToken');
            console.error(e);
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
                authResult: result,
                apiResponse: ''
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
