import { useState, useEffect } from "react";
import { View, Button, Text, StyleSheet, FlatList } from "react-native";

import { generateClient } from "aws-amplify/data";
import type { Schema } from "../amplify/data/resource";
import { GraphQLError } from "graphql";
const client = generateClient<Schema>();

const FileList = () => {
  const dateTimeNow = new Date();
  const [files, setFiles] = useState<Schema["File"]["type"][]>([]);
  const [errors, setErrors] = useState<GraphQLError>();

  useEffect(() => {
    const sub = client.models.File.observeQuery().subscribe({
      next: ({ items }) => {
        setFiles([...items]);
      },
    });

    return () => sub.unsubscribe();
  }, []);

  const createFile = async () => {
    try {
      await client.models.File.create({
        url: `http://myfile.com/${dateTimeNow.getUTCMilliseconds()}`,
        isDone:false
      });
    } catch (error: unknown) {
      if (error instanceof GraphQLError) {
        setErrors(error);
      } else {
        throw error;
      }
    }
  };

  if (errors) {
    return <Text>{errors.message}</Text>;
  }

  const renderItem = ({ item }: { item: Schema["File"]["type"] }) => (
    <FileItem {...item} />
  );
  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={files}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => (
          <View style={styles.listItemSeparator} />
        )}
        ListEmptyComponent={() => <Text>You have not uploaded any files yet</Text>}
        style={styles.listContainer}
      ></FlatList>
      <Button onPress={createFile} title="Upload File" />
    </View>
  );
};

const FileItem = (file: Schema["File"]["type"]) => (
  <View style={styles.fileItemContainer} key={file.id}>
    <Text
      style={{
        ...styles.fileItemText,
        textDecorationLine: file.isDone ? "line-through" : "none",
        textDecorationColor: file.isDone ? "red" : "black",
      }}
    >
      {file.url}
    </Text>
    <Button
      onPress={async () => {
        await client.models.File.delete(file);
      }}
      title="Delete"
    />
    <Button
      onPress={() => {
        client.models.File.update({
          id: file.id,
          isDone: !file.isDone,
        });
      }}
      title={file.isDone ? "Undo" : "Done"}
    />
  </View>
);

const styles = StyleSheet.create({
  fileItemContainer: { flexDirection: "row", alignItems: "center", padding: 8 },
  fileItemText: { flex: 1, textAlign: "center" },
  listContainer: { flex: 1, alignSelf: "stretch", padding:8 },
  listItemSeparator: { backgroundColor: "lightgrey", height: 2 },
});

export default FileList;