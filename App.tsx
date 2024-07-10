import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, SafeAreaView } from 'react-native';
import { Amplify } from "aws-amplify";
import { Authenticator, useAuthenticator } from "@aws-amplify/ui-react-native";
import outputs from "./amplify_outputs.json";
import TodoList from './src/TodoList';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import Chat from './src/Chat';
const Drawer = createDrawerNavigator();
Amplify.configure(outputs);



const App = () => {
  return (

    <Authenticator.Provider>
    <Authenticator>
      <SafeAreaView style={styles.container}>
        <SignOutButton />
        <NavigationContainer>
    <Drawer.Navigator initialRouteName="Home">
      <Drawer.Screen name="Home" component={TodoList} />
      <Drawer.Screen name="Notifications" component={Chat} />
    </Drawer.Navigator>
  </NavigationContainer>
      </SafeAreaView>
    </Authenticator>
  </Authenticator.Provider>

   
  );
};


const App2 = () => {
  return (
    <Authenticator.Provider>
      <Authenticator>
        <SafeAreaView style={styles.container}>
          <SignOutButton />
          <TodoList />
        </SafeAreaView>
      </Authenticator>
    </Authenticator.Provider>
  );
};
const SignOutButton = () => {
  const { signOut } = useAuthenticator();

  return (
    <View style={styles.signOutButton}>
      <Button title="Sign Out" onPress={signOut} />
    </View>
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