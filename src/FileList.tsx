import { useState, useEffect, useLayoutEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { uploadData } from "aws-amplify/storage";
import { getDocumentAsync } from "expo-document-picker";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useAuthenticator } from "@aws-amplify/ui-react-native";
import {
  createFileRecord,
  deleteFileRecord,
  getFiles,
  updateFileRecord,
} from "../data.service";

const FileList = ({ navigation }) => {
  const { user } = useAuthenticator((context) => [context.user]);

  const [files, setFiles] = useState<FileUpload[]>([]);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <AntDesign
          name="reload1"
          size={24}
          style={{ marginRight: 20 }}
          color="white"
          onPress={fetchData}
        />
      ),
    });
  });
  const handleDelete = (id: string) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.id !== id));
  };

  const fetchData = async () => {
    console.log("reloading");
    const data = await getFiles();
    setFiles(data);
  };

  useEffect(() => {
    fetchData();
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
        await createFileRecord({
          path: `files/${doc.name}`,
          isDone: false,
        });
        await fetchData();
      } else {
        alert("Error: No assets found.");
      }
    } catch (error) {
      alert("An error occurred during file upload.");
      console.error(error);
    }
  };

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <FlatList
        style={styles.listContainer}
        data={files}
        extraData={files}
        renderItem={({ item }) => (
          <FileItemComponent file={item} onDelete={handleDelete} />
        )}
        keyExtractor={(file) => file.id}
        ItemSeparatorComponent={() => <View style={styles.listItemSeparator} />}
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

      <Pressable style={styles.button} onPress={createFile}>
        <Text style={styles.text}>Upload a File</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
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

type FileItemProps = {
  file: FileUpload;
  onDelete: (id: string) => void;
};
const FileItemComponent: React.FC<FileItemProps> = ({ file, onDelete }) => {
  useEffect(() => {
    setIsDone(file.isDone);
  }, [file]);
  console.log(file);
  const [isDone, setIsDone] = useState(file.isDone);

  const toggleStatus = async () => {
    const originalIsDone = isDone;
    setIsDone((prevIsDone) => !prevIsDone); // Optimistic update

    try {
      await updateFileRecord({
        id: file.id,
        isDone: !originalIsDone,
      });
    } catch (error) {
      console.error("Failed to update file status", error);
      setIsDone(originalIsDone); // Revert to original state on error
    }
  };

  const handleDelete = async () => {
    try {
      await deleteFileRecord(file);
      onDelete(file.id); // Inform the parent component to remove this item
    } catch (error) {
      console.error("Failed to delete file", error);
    }
  };

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
        <Pressable onPress={toggleStatus}>
          {!isDone ? (
            <ActivityIndicator size="small" color="#0000ff" />
          ) : (
            <AntDesign
              name="checkcircle"
              size={24}
              style={{ marginLeft: 10 }}
              color="green"
            />
          )}
        </Pressable>

        <AntDesign
          name="delete"
          size={24}
          style={{ marginLeft: 10 }}
          color="black"
          onPress={handleDelete}
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
