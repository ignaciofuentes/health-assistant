import { generateClient } from "aws-amplify/api";
import { fetchAuthSession } from "aws-amplify/auth";
import { Schema } from "./amplify/data/resource";

const baseUrl = "https://9bl1cfubzg.execute-api.us-east-1.amazonaws.com/prod";

export const getConversations = async (): Promise<Conversation[]> => {
  //console.log("GETTING CONVERSATIONS");
  const session = await fetchAuthSession();
  const token = session.tokens?.idToken!.toString();
  //console.log(token);
  const headers = { Authorization: token! };
  var response = await fetch(`${baseUrl}/channels`, { headers });

  if (!response.ok) {
    alert("fetch error");
    return;
  }
  var data = await response.json();

  //console.log(data.Items);
  const convs: Conversation[] = data.Items.map((c) => ({
    id: c.sessionid,
    title: c.sessionid,
    messages: [{ id: c.sessionid, content: c.sessionid, from: "me" }],
  }));
  // return convs;
  //console.log(convs);
  //setConversations([...convs]);
  return convs;
};

export const createConversation = async ({ title }) => {
  //console.log("SAVING CONVERSATION");
  const session = await fetchAuthSession();
  const token = session.tokens?.idToken!.toString();
  //console.log(token);
  const headers = { Authorization: token! };
  var response = await fetch(`${baseUrl}/channels?sessionid=${title}`, {
    headers,
    method: "post",
  });
  var data = await response.json();
  console.log(data);

  return { data: { id: title, title: title } };
};

export const askQuestion = async ({ conversationId, content }) => {
  console.log("ASKING QUESTION");
  const session = await fetchAuthSession();
  const token = session.tokens?.idToken!.toString();
  //console.log(token);
  const headers = { Authorization: token! };
  var response = await fetch(`${baseUrl}/channels/${conversationId}/messages`, {
    headers,
    method: "post",
    body: JSON.stringify({
      session_id: conversationId,
      question: content,
      jwt_token: token,
    }),
  });

  var data = await response.json();
  console.log("ASKED QUESTION");
  console.log(data);
  return { data: { id: "1dsdfsdfds", title: "" } };
};

const client = generateClient<Schema>();
export const getFilesSubscription = (params) => {
  return client.models.File.observeQuery().subscribe(params);
};

export const createFileRecord = async (params) => {
  return client.models.File.create(params);
};

export const deleteFileRecord = async (params) => {
  return client.models.File.delete(params);
};
