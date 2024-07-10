import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, SafeAreaView } from 'react-native';
import { Amplify } from "aws-amplify";
import { Authenticator, useAuthenticator } from "@aws-amplify/ui-react-native";
import outputs from "./amplify_outputs.json";
import TodoList from './src/TodoList';
import { createDrawerNavigator, DrawerItem } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import Chat from './src/Chat';
const Drawer = createDrawerNavigator();
Amplify.configure(outputs);



const App = () => {
  return (

    <Authenticator.Provider>
    <Authenticator>
      <SafeAreaView style={styles.container}>
        
        <NavigationContainer>
          <Drawer.Navigator initialRouteName="Chat" drawerContent={(props) => <CustomDrawerContent {...props} />}>
            <Drawer.Screen name="Chat" component={TodoList} />
            <Drawer.Screen name="My Files" component={Chat} />
            

          </Drawer.Navigator>
        </NavigationContainer>
      </SafeAreaView>
    </Authenticator>
  </Authenticator.Provider>

   
  );
};


import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';

function CustomDrawerContent(props:any) {
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
    <SignOutButton />
    </DrawerContentScrollView>
  );
}

const SignOutButton = () => {
  const { signOut } = useAuthenticator();

  return (
    <DrawerItem
    label="Signout"
    onPress={signOut}
  />
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
  },
  signOutButton: {
    alignSelf: "flex-end",
  },
});
export default App;