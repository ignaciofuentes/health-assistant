import { useState, useEffect } from "react";
import { View, Button, Text, StyleSheet, FlatList } from "react-native";

import { generateClient } from "aws-amplify/data";
import type { Schema } from "../amplify/data/resource";
import { GraphQLError } from "graphql";
const client = generateClient<Schema>();

const Chat = () => {
  const dateTimeNow = new Date();
  const [errors, setErrors] = useState<GraphQLError>();

  useEffect(() => {}, []);

  if (errors) {
    return <Text>{errors.message}</Text>;
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Button title="Chat Goes here" />
    </View>
  );
};

const styles = StyleSheet.create({
  todoItemContainer: { flexDirection: "row", alignItems: "center", padding: 8 },
  todoItemText: { flex: 1, textAlign: "center" },
  listContainer: { flex: 1, alignSelf: "stretch", padding: 8 },
  listItemSeparator: { backgroundColor: "lightgrey", height: 2 },
});

export default Chat;
