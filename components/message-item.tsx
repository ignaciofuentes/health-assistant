import { View, Text, StyleSheet } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";

const MessageItemComponent = (message: Message) => {
  if (message.from === "human") {
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
  } else if (message.from === "ai") {
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
export default MessageItemComponent;
