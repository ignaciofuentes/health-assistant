import { useAuthenticator } from "@aws-amplify/ui-react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Alert, Pressable, Text } from "react-native";

const SignOutButton = () => {
  const { signOut } = useAuthenticator();

  const doConfirmBeforeSignout = () => {
    Alert.alert("Sign out?", "", [
      {
        text: "Cancel",
        onPress: () => {},
        style: "cancel",
      },
      { text: "Sign Out", onPress: () => signOut() },
    ]);
  };

  return (
    <Pressable
      style={{
        flexDirection: "row",
        alignItems: "center",
        margin: 20,
        justifyContent: "flex-start",
      }}
      onPress={doConfirmBeforeSignout}
    >
      <AntDesign style={{}} name="logout" size={24} color="white" />
      <Text style={{ marginLeft: 10, color: "white" }}>Signout</Text>
    </Pressable>
  );
};

export default SignOutButton;
