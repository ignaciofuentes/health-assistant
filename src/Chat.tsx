import { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Image } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { TextInput } from "react-native-gesture-handler";
import { askQuestion, makeid } from "../data.service";
import { useAppContext } from "./../AppContext";
import MessageItemComponent from "../components/message-item";

const Chat = ({ navigation }) => {
  const { handleFunction } = useAppContext();

  const [message, setMessage] = useState<Message | null>(null);

  const [typedMessage, setTypedMessage] = useState<string>("");

  async function sendMessage() {
    {
      const askedQuestion = typedMessage;
      const title = askedQuestion.substring(0, 20);
      const conversationId = makeid(5);
      setTypedMessage("");
      setMessage({
        from: "human",
        content: askedQuestion,
        id: makeid(5),
        conversationId: conversationId,
      });
      setTypedMessage("");

      var response2 = await askQuestion({
        conversationId: conversationId,
        content: askedQuestion,
      });

      const conv = {
        id: conversationId,
        title: title,
        messages: [
          { id: title, content: askedQuestion, from: "human" },
          { id: response2?.id, content: response2?.content, from: "ai" },
        ],
      };
      setMessage(null);

      navigation.navigate("ChatContinue", {
        conversation: conv,
      });

      await handleFunction();
    }
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "white",
      }}
    >
      {message ? (
        <View style={{ margin: 10 }}>
          <MessageItemComponent {...message}></MessageItemComponent>
        </View>
      ) : (
        <Text></Text>
      )}

      <View
        style={{
          flexDirection: "row",
          flex: 1,
          justifyContent: "center",
          marginTop: 200,
        }}
      >
        {message === null ? (
          <View>
            <Image
              source={require("../healthlogo.png")}
              style={{ width: 140, height: 140 }}
            />
            <Text style={{ fontSize: 20 }}>How can I help?</Text>
          </View>
        ) : (
          <ActivityIndicator
            color="#ff9900"
            style={{
              alignSelf: "flex-start",
              top: -80,
            }}
          />
        )}
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
  textInputStyles: {
    flex: 1,
    padding: 10,
    margin: 10,
  },
});

export default Chat;
