import { useState, useEffect, useRef } from "react";
import { View, Button, Text, StyleSheet, FlatList } from "react-native";
import { GraphQLError } from "graphql";
import AntDesign from "@expo/vector-icons/AntDesign";
import { TextInput } from "react-native-gesture-handler";
import { askQuestion, createConversation } from "../data.service";
import { useAppContext } from "./../AppContext";

interface Message {
  id: string;
  content: string;
  from: "me" | "bot";
}

//const client = generateClient<Schema>();

const Chat = ({ navigation }) => {
  const flatListRef = useRef(null);
  const { handleFunction } = useAppContext();

  // useEffect(() => {
  //   //console.log("convd id", conversationId);
  //   navigation.setOptions({
  //     headerRight: () => (
  //       <AntDesign
  //         name="plus"
  //         size={26}
  //         color="white"
  //         onPress={() => {
  //           setConversationId("");
  //           setMessages([]);
  //           sub.unsubscribe();
  //           sub = client.models.Message.observeQuery({
  //             filter: {
  //               conversationId: {
  //                 eq: conversationId,
  //               },
  //             },
  //           }).subscribe({
  //             next: ({ items }) => {
  //               setLoading(false);
  //               setMessages([...items]);
  //             },
  //           });
  //         }}
  //         style={{ marginRight: 10 }}
  //       />
  //     ),
  //   });
  //   var sub = client.models.Message.observeQuery({
  //     filter: {
  //       conversationId: {
  //         eq: conversationId,
  //       },
  //     },
  //   }).subscribe({
  //     next: ({ items }) => {
  //       setLoading(false);
  //       //setMessages([...items]);
  //     },
  //   });
  //   return () => sub.unsubscribe();
  // }, [navigation]);

  const dateTimeNow = new Date();
  var myMessages: Message[] = Array.from({ length: 10 }, (_, i) => ({
    id: i.toString(),
    content:
      i % 2 === 0
        ? "Hello World" + i
        : "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    from: i % 2 === 0 ? "me" : "bot",
  }));
  const [messages, setMessages] = useState<Message[]>([]);

  const [errors, setErrors] = useState<GraphQLError>();
  const [loading, setLoading] = useState<boolean>(false);
  const [typedMessage, setTypedMessage] = useState<string>("");
  const [conversationId, setConversationId] = useState<string>("");

  async function sendMessage() {
    {
      var response = await createConversation({
        title: typedMessage.substring(0, 20),
      });

      var response2 = await askQuestion({
        conversationId: response.data.id,
        content: typedMessage.substring(0, 20),
      });

      const conv = {
        id: response.data!.id,
        title: response.data!.title,
        messages: [
          { id: "hkhkjhkjhjkhjk", content: typedMessage, from: "me" },
          // {
          //   id: response2.data?.id,
          //   content: response2.data?.content,
          //   from: "me",
          // },
        ],
      };
      navigation.navigate("ChatContinue", {
        conversation: conv,
      });
      //console.log("Message saved");
      //console.log(response2.data?.id);

      setTypedMessage("");
      await handleFunction();
      //await reloadConversationList();
      // setTimeout(
      //   () => flatListRef.current.scrollToEnd({ animated: true }),
      //   100
      // );
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
      <View
        style={{
          flexDirection: "row",
          flex: 1,
          justifyContent: "center",
          marginTop: 300,
        }}
      >
        <Text>How can I help?</Text>
      </View>

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
