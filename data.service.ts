import { fetchAuthSession } from "aws-amplify/auth";

export const getConversations = async (): Promise<Conversation[]> => {
  console.log("GETTING CONVERSATIONS");
  const session = await fetchAuthSession();
  const token = session.tokens?.idToken!.toString();
  //console.log(token);
  const headers = { Authorization: token! };
  var response = await fetch(
    "https://9bl1cfubzg.execute-api.us-east-1.amazonaws.com/prod/channels",
    { headers }
  );

  var data = await response.json();

  console.log(data.Items);
  const convs: Conversation[] = data.Items.map((c) => ({
    id: c.sessionid,
    title: c.sessionid,
    messages: [{ id: c.sessionid, content: c.sessionid, from: "me" }],
  }));
  // return convs;
  console.log(convs);
  //setConversations([...convs]);
  return convs;
};

export const createConversation = async ({ title }) => {
  console.log("SAVING CONVERSATION");
  const session = await fetchAuthSession();
  const token = session.tokens?.idToken!.toString();
  //console.log(token);
  const headers = { Authorization: token! };
  var response = await fetch(
    `https://9bl1cfubzg.execute-api.us-east-1.amazonaws.com/prod/channels?sessionid=${title}`,
    { headers, method: "post" }
  );
  var data = await response.json();
  console.log(data);
  return { data: { id: "1dsdfsdfds", title: "" } };
};
