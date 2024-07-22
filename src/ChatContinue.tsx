import { useState, useEffect, useRef, useCallback } from "react";
import { View, Button, Text, StyleSheet, FlatList } from "react-native";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../amplify/data/resource";
import { GraphQLError } from "graphql";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useAuthenticator } from "@aws-amplify/ui-react-native";
import { TextInput } from "react-native-gesture-handler";
import { useFocusEffect } from "@react-navigation/native";
import { askQuestion } from "../data.service";

const client = generateClient<Schema>();

const ChatContinue = (props) => {
  const { conversation } = props.route.params;
  const [messages, setMessages] = useState<Message[]>();
  const [errors, setErrors] = useState<GraphQLError>();
  const [loading, setLoading] = useState<boolean>(false);
  const [typedMessage, setTypedMessage] = useState<string>("");

  useEffect(() => {
    props.navigation.setOptions({ title: conversation.title });
    //console.log("test");
  });
  const flatListRef = useRef(null);

  const dateTimeNow = new Date();

  async function sendMessage() {
    {
      // setMessages((prevMessages) => [
      //   ...prevMessages,
      //   { id: "asdasdasdasd", content: typedMessage, from: "me" },
      // ]);
      // const response = await client.models.Message.create({
      //   content: typedMessage,
      //   from: "me",
      //   conversationId: conversation.id,
      // });

      const response = await askQuestion({
        conversationId: conversation.id,
        content: typedMessage,
      });

      conversation.messages.push({
        //id: response.data!.id || "sdfsdfsd",
        id: "sdfsdfsdfsdfsdf",
        content: typedMessage,
        from: "me",
      });
      setTypedMessage("");
    }
  }

  if (errors) {
    return <Text>{errors.message}</Text>;
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "white",
      }}
    >
      {loading ? (
        <Text>Loading</Text>
      ) : (
        <FlatList
          ref={flatListRef}
          style={styles.listContainer}
          data={conversation.messages}
          renderItem={({ item }) => <MessageItemComponent {...item} />}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={() => (
            <View
              style={{
                flexDirection: "row",
                flex: 1,
                justifyContent: "center",
                marginTop: 300,
              }}
            >
              <View>
                <Text>{conversation.id}</Text>
                <Text>{conversation.messages.length}</Text>
              </View>
            </View>
          )}
        ></FlatList>
      )}
      <View
        style={{
          flexDirection: "row",
          borderWidth: 1,
          alignItems: "center",
          margin: 10,
          borderRadius: 4,
        }}
      >
        <TextInput
          style={styles.textInputStyles}
          placeholder="Message Health Assistant"
          value={typedMessage}
          onChangeText={setTypedMessage}
          onSubmitEditing={sendMessage}
        />
        <AntDesign
          name="upcircle"
          size={26}
          color="gray"
          style={{ marginRight: 10 }}
        />
      </View>
    </View>
  );
  return <Text>Test</Text>;
};

const styles = StyleSheet.create({
  fileItemContainer: { flexDirection: "row", alignItems: "center" },
  fileItemText: { flex: 1, textAlign: "center" },
  listContainer: { flex: 1, margin: 10, backgroundColor: "white" },
  listItemSeparator: { backgroundColor: "lightgrey" },
  textInputStyles: {
    flex: 1,
    padding: 10,
    margin: 10,
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
  },
});

const MessageItemComponent = (message: Message) => {
  if (message.from === "me") {
    return (
      <View style={messageItemStyle.container}>
        <Text
          style={{
            padding: 20,
            backgroundColor: "#F4F4F4",
            borderRadius: 20,
            overflow: "hidden",
          }}
        >
          {message.content}
        </Text>
      </View>
    );
  } else if (message.from === "bot") {
    return (
      <View style={messageItemStyle.containerBot}>
        <AntDesign
          name="wechat"
          size={26}
          color="gray"
          style={{ marginRight: 10 }}
        />
        <Text style={{ flex: 1 }}>{message.content}</Text>
      </View>
    );
  }
};

const messageItemStyle = StyleSheet.create({
  container: {
    flexDirection: "column",
    alignItems: "flex-end",
    justifyContent: "flex-start",
    margin: 20,
    borderRadius: 20,
  },
  containerBot: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginRight: 30,
  },
});

export default ChatContinue;
