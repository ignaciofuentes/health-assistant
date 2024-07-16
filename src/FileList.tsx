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

  useEffect(() => {
    console.log("running use effect");
    const sub = client.models.File.observeQuery().subscribe({
      next: ({ items }) => {
        setFiles([...items]);
      },
    });

    return () => sub.unsubscribe();
  }, []);

  const createFile2 = async () => {
    try {
      const result = await getDocumentAsync({ multiple: false });
      if (result.canceled) {
        alert("no file selected.");
      } else {
        console.log("uploading");
        if (result?.assets != null) {
          var doc = result?.assets[0];
          const fileData = await fetch(doc.uri);
          const blob = await fileData.blob();
          console.log("OK LETS UPLOAD!!!");
          const uploadResponse = await uploadData({
            path: "files/" + doc.name,
            data: blob,
          }).result;
          console.log("Succeeded: ", uploadResponse);
          console.log(uploadResponse.path);
          await client.models.File.create({
            path: "files/" + doc.name,
            isDone: false,
          });
        } else {
          alert("error???.");
        }
      }
    } catch {
      alert("ERROR");
    }
  };

  const createFile = async () => {
    try {
      const result = await getDocumentAsync({ multiple: false });

      if (result.canceled) {
        alert("No file selected.");
        return;
      }

      console.log("Uploading...");

      if (result.assets) {
        const doc = result.assets[0];
        const fileData = await fetch(doc.uri);
        const blob = await fileData.blob();

        console.log("Preparing to upload...");

        const uploadResponse = await uploadData({
          path: `files/${doc.name}`,
          data: blob,
        });

        await client.models.File.create({
          path: `files/${doc.name}`,
          isDone: false,
        });
      } else {
        alert("Error: No assets found.");
      }
    } catch (error) {
      alert("An error occurred during file upload.");
      console.error(error);
    }
  };

  const save = async () => {};

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
      {file.path?.split("/").pop()}
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
