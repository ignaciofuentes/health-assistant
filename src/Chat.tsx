import { useState, useEffect, useRef } from "react";
import {
  View,
  Button,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { list, uploadData } from "aws-amplify/storage";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../amplify/data/resource";
import { GraphQLError } from "graphql";
import { DocumentPickerResult, getDocumentAsync } from "expo-document-picker";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useAuthenticator } from "@aws-amplify/ui-react-native";
import { TextInput } from "react-native-gesture-handler";

interface Message {
  id: string;
  content: string;
  from: "me" | "bot";
}

const client = generateClient<Schema>();

const Chat = () => {
  const { user } = useAuthenticator((context) => [context.user]);
  const th: Message = { id: "1", content: "", from: "me" };
  const flatListRef = useRef(null);

  const dateTimeNow = new Date();
  var myMessages: Message[] = Array.from({ length: 10 }, (_, i) => ({
    id: i.toString(),
    content:
      i % 2 === 0
        ? "Hello World" + i
        : "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    from: i % 2 === 0 ? "me" : "bot",
  }));
  const [messages, setMessages] = useState<Message[]>(myMessages);
  const [errors, setErrors] = useState<GraphQLError>();
  const [loading, setLoading] = useState<boolean>(true);
  const [typedMessage, setTypedMessage] = useState<string>("");

  useEffect(() => {
    const sub = client.models.File.observeQuery().subscribe({
      next: ({ items }) => {
        setLoading(false);
      },
    });

    return () => sub.unsubscribe();
  }, []);

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
          data={messages}
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
              <Text>You have not uploaded any files yet</Text>
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
          onSubmitEditing={() => {
            setMessages([
              ...messages,
              { id: "asdasdasd", content: typedMessage, from: "me" },
            ]);
            setTypedMessage("");
            setTimeout(
              () => flatListRef.current.scrollToEnd({ animated: true }),
              100
            );
          }}
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
  } else {
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

export default Chat;
