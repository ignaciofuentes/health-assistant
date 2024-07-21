import "react-native-gesture-handler";
import { useState, useEffect } from "react";

import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  Alert,
  Pressable,
  Button,
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
import { GraphQLError } from "graphql";

import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";

import Chat from "./src/Chat";
import AntDesign from "@expo/vector-icons/AntDesign";
import { generateClient } from "aws-amplify/api";
import { Schema } from "./amplify/data/resource";
import ChatContinue from "./src/ChatContinue";

const Drawer = createDrawerNavigator();
Amplify.configure(outputs);
console.log(Amplify.getConfig());
const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,

    text: "white",
    card: "#232f3e",
  },
};
const client = generateClient<Schema>();

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
                initialRouteName="Health Assistant"
                drawerContent={(props) => <CustomDrawerContent {...props} />}
              >
                <Drawer.Screen name="Health Assistant" component={Chat} />
                <Drawer.Screen name="ChatContinue" component={ChatContinue} />
              </Drawer.Navigator>
            </NavigationContainer>
          </Authenticator>
        </Authenticator.Provider>
      </ThemeProvider>
    </SafeAreaView>
  );
};

function CustomDrawerContent(props: any) {
  const dateTimeNow = new Date();
  const [files, setFiles] = useState<Schema["File"]["type"][]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);

  const [errors, setErrors] = useState<GraphQLError>();
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    // const sub = client.models.Conversation.list().subscribe({
    //   next: ({ items }) => {
    //     setConversations([...items]);
    //   },
    // });
    //return () => sub.unsubscribe();client.models.Conversation.list()

    client.models.Conversation.list({
      selectionSet: ["id", "title", "messages.*"],
    }).then((res) => {
      //console.log(res);
      //console.log(res.data);
      const convs = res.data.map((c) => ({
        id: c.id!,
        title: c.title!,
        messages: c.messages,
      }));
      //console.log("convs are");
      //console.log(convs);
      setConversations([...convs]);
    });

    fetch(
      "https://9bl1cfubzg.execute-api.us-east-1.amazonaws.com/prod/channels",
      {}
    )
      .then((response) => {
        console.log(response);
        return response.json();
      })
      .then((data) => {
        console.log(data.message);
        const convs = data.map((c) => ({
          id: c.id!,
          title: c.title!,
          messages: c.messages,
        }));
        setConversations([...convs]);
      })
      .catch((e) => {
        //alert(e);
      });
  }, []);
  return (
    <View
      style={{
        flex: 1,
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <View
        style={{
          justifyContent: "space-between",
          flexDirection: "row",
          marginHorizontal: 20,
          marginBottom: 20,
        }}
      >
        <AntDesign
          name="menuunfold"
          size={24}
          color="white"
          onPress={() => {
            props.navigation.toggleDrawer();
          }}
        />
        <AntDesign
          name="edit"
          size={24}
          color="white"
          onPress={() => {
            //props.navigation.navigate("");
            //alert("dsdfsf");
            //props.navigation.toggleDrawer();
          }}
        />
      </View>
      <DrawerContentScrollView {...props} style={styles.drawerContent}>
        <Drawer.Screen name="Health Assistant" component={Chat} />
        <DrawerItem
          key="health"
          label="Health Assistant"
          onPress={() => {
            props.navigation.navigate("Health Assistant");
            //props.navigation.toggleDrawer();
          }}
        />
        <View style={{ marginTop: 30 }}>
          <Text style={{ color: "white", marginLeft: 16 }}>Conversations</Text>
          {conversations.map((c, i) => {
            return (
              <DrawerItem
                key={i}
                label={c.title!}
                onPress={() => {
                  //console.log("passing conversation");
                  //console.log(c);
                  props.navigation.navigate("ChatContinue", {
                    conversation: c,
                  });
                }}
              />
            );
          })}
        </View>
      </DrawerContentScrollView>
      <DrawerItem label="My Files" onPress={() => {}} />

      <SignOutButton />
    </View>
  );
}

const SignOutButton = () => {
  const { signOut } = useAuthenticator();

  const doConfirmBeforeSignout = () => {
    Alert.alert("Sign out?", "", [
      {
        text: "Cancel",
        onPress: () => {},
        style: "cancel",
      },
      { text: "Sign Out", onPress: () => signOut() },
    ]);
  };

  return (
    <Pressable
      style={{
        flexDirection: "row",
        alignItems: "center",
        margin: 20,
        justifyContent: "flex-start",
      }}
      onPress={doConfirmBeforeSignout}
    >
      <AntDesign style={{}} name="logout" size={24} color="white" />
      <Text style={{ marginLeft: 10, color: "white" }}>Signout</Text>
    </Pressable>
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
