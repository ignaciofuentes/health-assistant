import { generateClient } from "aws-amplify/api";
import { fetchAuthSession } from "aws-amplify/auth";
import { Schema } from "./amplify/data/resource";

const baseUrl = "https://kjln2vj9w2.execute-api.us-east-1.amazonaws.com/prod";

export function makeid(length) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

export const getConversations = async (): Promise<Conversation[]> => {
  //console.log("GETTING CONVERSATIONS");
  const session = await fetchAuthSession();
  const token = session.tokens?.idToken!.toString();
  //console.log(token);
  const headers = { Authorization: token! };
  try {
    var response = await fetch(`${baseUrl}/channels`, { headers });

    //console.log(response.status);
    if (!response.ok) {
      alert("fetch error");
      return;
    }
    var data = await response.json();
    //console.log(data.Items);
    const convs: Conversation[] = data.Items.map((c) => {
      //console.log(c.Items.length);
      return {
        id: c.sessionid,
        title: c.History[0].data.content || "NO TITLE SET",
        messages: c.History
          ? c.History.map((d) => {
              return {
                id: makeid(5),
                content: d.data.content,
                from: d.data.type,
              };
            })
          : [{ id: c.sessionid, content: c.sessionid, from: "me" }],
        //messages: [{ id: c.sessionid, content: c.sessionid, from: "me" }],
      };
    });
    return convs;
  } catch (e) {
    alert(e);
    return [];
  }
};

export const askQuestion = async ({ conversationId, content }) => {
  //console.log(content);
  const session = await fetchAuthSession();
  const token = session.tokens?.idToken?.toString();
  if (!token) {
    throw new Error("Authentication token not found");
  }
  const headers = { Authorization: token };
  const response = await fetch(
    `${baseUrl}/channels/${conversationId}/messages`,
    {
      headers,
      method: "POST",
      body: JSON.stringify({
        question: content,
      }),
    }
  );
  const data = await response.json();
  //console.log("THE ASK QUESTION RESPONSE IS");
  //console.log(data);
  if (data.Items && data.status === "success") {
    const llmResponse = data.Items[0];
    return { id: makeid(5), content: llmResponse };
  } else {
    return {
      id: makeid(5),
      content: "Sorry. We ran into an issue producing a response",
    };
  }
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
