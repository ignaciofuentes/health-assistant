import { useState, useEffect } from "react";
import { View, Button, Text, StyleSheet, FlatList } from "react-native";
import { uploadData } from "aws-amplify/storage";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../amplify/data/resource";
import { GraphQLError } from "graphql";
import { DocumentPickerResult, getDocumentAsync } from "expo-document-picker";

const client = generateClient<Schema>();

const FileList = () => {
  const dateTimeNow = new Date();
  const [files, setFiles] = useState<Schema["File"]["type"][]>([]);
  const [errors, setErrors] = useState<GraphQLError>();
  const [file, setFile] = useState<DocumentPickerResult>();

  useEffect(() => {
    console.log("running use effect");
    const sub = client.models.File.observeQuery().subscribe({
      next: ({ items }) => {
        setFiles([...items]);
      },
    });

    return () => sub.unsubscribe();
  }, []);

  const createFile = async () => {
    try {
      const doc = await getDocumentAsync({});
      setFile(doc);
      await upload();
      await save();
    } catch {
      console.log("error");
    }
  };
  const upload = async () => {
    console.log("uploading");
    if (file?.assets != null) {
      var doc = file?.assets[0];
      const response = await fetch(doc.uri);
      const blob = await response.blob();

      try {
        uploadData({
          path: "files/" + doc.name,
          data: blob,
        });
      } catch (error) {
        console.log("error");
      }
    }
  };

  const save = async () => {
    console.log("saving");

    try {
      await client.models.File.create({
        url: `http://myfile.com/${dateTimeNow.getUTCMilliseconds()}`,
        isDone: false,
      });
    } catch (error: unknown) {
      alert("error");
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
        ItemSeparatorComponent={() => <View style={styles.listItemSeparator} />}
        ListEmptyComponent={() => (
          <Text>You have not uploaded any files yet</Text>
        )}
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
  listContainer: { flex: 1, alignSelf: "stretch", padding: 8 },
  listItemSeparator: { backgroundColor: "lightgrey", height: 2 },
});

export default FileList;
