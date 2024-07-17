import "react-native-gesture-handler";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  Alert,
} from "react-native";
import { Amplify } from "aws-amplify";
import {
  Authenticator,
  Theme,
  useAuthenticator,
  useTheme,
} from "@aws-amplify/ui-react-native";
import outputs from "./amplify_outputs.json";
import FileList from "./src/FileList";
import { createDrawerNavigator, DrawerItem } from "@react-navigation/drawer";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { ThemeProvider } from "@aws-amplify/ui-react-native";

import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";

import Chat from "./src/Chat";

const Drawer = createDrawerNavigator();
Amplify.configure(outputs);
const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,

    text: "white",
    card: "#232f3e",
  },
};

const MyAppHeader = () => {
  const {
    tokens: { space, fontSizes, colors, radii },
  } = useTheme();
  return (
    <View style={[styles.headerContainer, { padding: space.medium }]}>
      <Text style={[styles.headerText, { fontSize: fontSizes.xl }]}>
        Health Assistant
      </Text>
      <Image source={require("./loginimage.png")} style={styles.headerImage} />
    </View>
  );
};

const AuthenticatorContainer = (props: any) => {
  const {
    tokens: { space, fontSizes, colors },
  } = useTheme();
  return (
    <Authenticator.Container
      {...props}
      style={{ backgroundColor: "#232f3e" }}
    />
  );
};

const App = () => {
  const {
    tokens: { space, fontSizes, colors, radii },
  } = useTheme();
  const theme: Theme = {
    components: {
      label: {
        primary: {
          color: "red",
        },
        text: {
          color: "green",
        },
      },
      textField: {
        fieldContainer: {
          borderColor: "#007eb9",
        },
        error: {
          backgroundColor: "green",
        },
        container: {
          borderBlockColor: "red",
          borderColor: "red",
        },
        field: {
          color: "white",
          textDecorationColor: "orange",
          borderBlockColor: "red",
          borderColor: "red",
        },
        label: {
          color: "white",
          borderBlockColor: "red",
          borderColor: "red",
        },
      },
      passwordField: {
        field: {
          borderBlockColor: "red",
          borderColor: "red",
        },
        label: {
          borderBlockColor: "red",
          borderColor: "red",
        },
        fieldContainer: {
          borderBlockColor: "red",
          borderColor: "red",
        },
        container: {
          borderBlockColor: "red",
          borderColor: "red",
        },
      },

      button: {
        container: {},
      },
    },
    tokens: {
      colors: {
        primary: {
          80: "#ff9900",
        },

        font: {
          primary: "white",
          tertiary: "white",
        },
      },
    },
  };
  return (
    <SafeAreaView style={styles.safeAreaView}>
      <ThemeProvider theme={theme}>
        <Authenticator.Provider>
          <Authenticator
            Container={AuthenticatorContainer}
            Header={MyAppHeader}
          >
            <NavigationContainer theme={MyTheme}>
              <Drawer.Navigator
                initialRouteName="Chat"
                drawerContent={(props) => <CustomDrawerContent {...props} />}
              >
                <Drawer.Screen name="Chat" component={Chat} />
                <Drawer.Screen name="My Files" component={FileList} />
              </Drawer.Navigator>
            </NavigationContainer>
          </Authenticator>
        </Authenticator.Provider>
      </ThemeProvider>
    </SafeAreaView>
  );
};

function CustomDrawerContent(props: any) {
  return (
    <DrawerContentScrollView {...props} style={styles.drawerContent}>
      <DrawerItemList {...props} />
      <SignOutButton />
    </DrawerContentScrollView>
  );
}

const SignOutButton = () => {
  const { signOut } = useAuthenticator();

  const doConfirmBeforeSignout = () => {
    Alert.alert("Sign out?", "", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      { text: "Sign Out", onPress: () => signOut() },
    ]);
  };

  return (
    <DrawerItem
      style={{}}
      label="Signout"
      onPress={doConfirmBeforeSignout}
    ></DrawerItem>
  );
};

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: "#232f3e",
  },
  headerContainer: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    margin: 16,
  },
  headerText: {
    color: "#ff9900", // AWS Amplify orange
    fontWeight: "bold",
    marginBottom: 20,
  },
  headerImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  drawerContent: {
    backgroundColor: "#232f3e", // Dark background for drawer
  },
  drawerLabel: {},
  drawerSignOut: {},
});

export default App;
