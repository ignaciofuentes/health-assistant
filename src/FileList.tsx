import { useState, useEffect } from "react";
import {
  View,
  Button,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { uploadData } from "aws-amplify/storage";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../amplify/data/resource";
import { GraphQLError } from "graphql";
import { DocumentPickerResult, getDocumentAsync } from "expo-document-picker";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useAuthenticator } from "@aws-amplify/ui-react-native";

//const client = generateClient<Schema>();

const FileList = () => {
  const { user } = useAuthenticator((context) => [context.user]);

  const dateTimeNow = new Date();
  const [files, setFiles] = useState<Schema["File"]["type"][]>([]);
  const [errors, setErrors] = useState<GraphQLError>();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // const sub = client.models.File.observeQuery().subscribe({
    //   next: ({ items }) => {
    //     setFiles([...items]);
    //     setLoading(false);
    //   },
    // });
    //return () => sub.unsubscribe();
  }, []);

  const createFile = async () => {
    try {
      const result = await getDocumentAsync({
        multiple: false,
        type: "application/pdf",
      });
      if (result.canceled) {
        alert("No file selected.");
        return;
      }
      if (result.assets) {
        const doc = result.assets[0];
        const fileData = await fetch(doc.uri);
        const blob = await fileData.blob();
        const uploadResponse = await uploadData({
          path: `files/${user.signInDetails?.loginId}/${doc.name}`,
          data: blob,
        });
        // await client.models.File.create({
        //   path: `files/${doc.name}`,
        //   isDone: false,
        // });
      } else {
        alert("Error: No assets found.");
      }
    } catch (error) {
      alert("An error occurred during file upload.");
      console.error(error);
    }
  };

  if (errors) {
    return <Text>{errors.message}</Text>;
  }

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      {loading ? (
        <Text>Loading</Text>
      ) : (
        <FlatList
          style={styles.listContainer}
          data={files}
          renderItem={({ item }) => <FileItemComponent {...item} />}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={() => (
            <View style={styles.listItemSeparator} />
          )}
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
      <Pressable style={styles.button} onPress={createFile}>
        <Text style={styles.text}>Upload a File</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  fileItemContainer: { flexDirection: "row", alignItems: "center" },
  fileItemText: { flex: 1, textAlign: "center" },
  listContainer: { flex: 1, margin: 10 },
  listItemSeparator: { backgroundColor: "lightgrey", height: 2 },
  button: {
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    margin: 10,
    borderRadius: 4,
    backgroundColor: "#232f3e",
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
  },
});

const FileItemComponent = (file: Schema["File"]["type"]) => {
  return (
    <View style={fileItemStyle.container}>
      <View style={fileItemStyle.column1}>
        <AntDesign name="pdffile1" size={40} color="red" />
      </View>
      <View style={fileItemStyle.column2}>
        <Text style={fileItemStyle.textTop}>{file.path?.split("/").pop()}</Text>
        <Text style={fileItemStyle.textBottom}>{file.createdAt}</Text>
      </View>
      <View style={fileItemStyle.column3}>
        {!file.isDone ? (
          <Pressable
            onPress={() => {
              // client.models.File.update({
              //   id: file.id,
              //   isDone: !file.isDone,
              // });
            }}
          >
            <ActivityIndicator size="small" color="#0000ff" />
          </Pressable>
        ) : (
          <AntDesign
            name="checkcircle"
            size={24}
            style={{ marginLeft: 10 }}
            color="green"
            onPress={async () => {
              //await client.models.File.delete(file);
            }}
          />
        )}

        <AntDesign
          name="delete"
          size={24}
          style={{ marginLeft: 10 }}
          color="black"
          onPress={async () => {
            await client.models.File.delete(file);
          }}
        />
      </View>
    </View>
  );
};

const fileItemStyle = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  column1: {
    flex: 1,
    alignItems: "center",
  },
  column2: {
    flex: 3,
    alignItems: "flex-start",
  },
  column3: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "flex-end",
    marginRight: 10,
  },
  textTop: {
    fontSize: 16,
    fontWeight: "bold",
  },
  textBottom: {
    fontSize: 14,
    color: "gray",
  },
});

export default FileList;
