import { useState, useEffect, useRef, useCallback } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { GraphQLError } from "graphql";
import AntDesign from "@expo/vector-icons/AntDesign";
import { TextInput } from "react-native-gesture-handler";
import { askQuestion, makeid } from "../data.service";
import MessageItemComponent from "../components/message-item";

const ChatContinue = (props) => {
  const { conversation } = props.route.params;
  //console.log(conversation);
  const [messages, setMessages] = useState<Message[]>();
  const [errors, setErrors] = useState<GraphQLError>();
  const [loading, setLoading] = useState<boolean>(false);
  const [typedMessage, setTypedMessage] = useState<string>("");

  useEffect(() => {
    props.navigation.setOptions({ title: conversation.title });
    setTimeout(() => flatListRef.current.scrollToEnd({ animated: false }), 100);
  });
  const flatListRef = useRef(null);

  const dateTimeNow = new Date();

  async function sendMessage() {
    {
      var question = typedMessage;
      conversation.messages.push({
        id: makeid(5),
        content: typedMessage,
        from: "human",
      });
      setTypedMessage("");
      const response = await askQuestion({
        conversationId: conversation.id,
        content: question,
      });

      conversation.messages.push({
        id: makeid(5),
        content: response.content,
        from: "ai",
      });
      setTypedMessage("getting response");
      setTimeout(
        () => flatListRef.current.scrollToEnd({ animated: true }),
        500
      );
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
          keyExtractor={(item) => makeid(5)}
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
  listContainer: { flex: 1, margin: 10, backgroundColor: "white" },
  textInputStyles: {
    flex: 1,
    padding: 10,
    margin: 10,
  },
});

export default ChatContinue;
