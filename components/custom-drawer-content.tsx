import "react-native-gesture-handler";
import React, { useState, useEffect } from "react";

import { StyleSheet, Text, View } from "react-native";

import { createDrawerNavigator, DrawerItem } from "@react-navigation/drawer";

import { DrawerContentScrollView } from "@react-navigation/drawer";

import AntDesign from "@expo/vector-icons/AntDesign";
import Chat from "../src/Chat";
import SignOutButton from "./sign-out-button";
import { getConversations } from "../data.service";

function CustomDrawerContent({ navigation, drawer, conversations }) {
  //const [conversations, setConversations] = useState<Conversation[]>([]);

  // useEffect(() => {
  //   getConversations().then((conversations: any) => {
  //     //console.log("BACK FROM FETCH");
  //     //console.log(res.data);
  //     //console.log(conversations);
  //     const convs = conversations.map((c) => ({
  //       id: c.id!,
  //       title: c.title!,
  //       messages: c.messages,
  //     }));
  //     //console.log("convs are");
  //     //console.log(convs);
  //     //setConversations([...convs]);
  //   });
  // }, []);
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
            navigation.toggleDrawer();
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
      <DrawerContentScrollView style={styles.drawerContent}>
        <drawer.Screen name="Health Assistant" component={Chat} />
        <DrawerItem
          key="health"
          label="Health Assistant"
          onPress={() => {
            navigation.navigate("Health Assistant");
          }}
        />
        <View style={{ marginTop: 30 }}>
          <Text style={{ color: "white", marginLeft: 16 }}>Conversations</Text>
          {conversations.map((c, i) => {
            return (
              <View key={i}>
                <Text
                  onPress={() => {
                    //console.log("passing conversation");
                    //console.log(c);
                    navigation.navigate("ChatContinue", {
                      conversation: c,
                    });
                  }}
                  style={{ color: "white", margin: 20, fontSize: 18 }}
                >
                  {c.title}
                </Text>
              </View>
            );
          })}
        </View>
      </DrawerContentScrollView>
      <DrawerItem
        label="My Files"
        onPress={() => {
          navigation.navigate("My Files");
        }}
      />

      <SignOutButton />
    </View>
  );
}

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

export default CustomDrawerContent;
