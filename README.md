react-native --version="0.57.8" init aadb2cpoc

yarn add react-navigation
yarn add react-native-gesture-handler
react-native link react-native-gesture-handler
yarn add react-native-vector-icons
react-native link react-native-vector-icons

yarn add react-native-msal-plugin
react-native link react-native-msal-plugin

cd ios
pod install
pod update

open aadb2cpos.xcworkspace in XCode
set up keychain sharing, add com.microsoft.adalcache

react-native run-ios