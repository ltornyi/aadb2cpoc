# Create
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

    add URL scheme, redirection handler as described on [the plugin repo](https://github.com/rmcfarlane82/react-native-msal-plugin#readme).
    open aadb2cpos.xcworkspace in XCode
    set up keychain sharing, add com.microsoft.adalcache
    modify AndroidManifest.xml

# Use
    git clone https://github.com/ltornyi/aadb2cpoc.git
    react-native run-ios
    react-native run-android
