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

export const getConversations = async (): Promise<
  Conversation[] | undefined
> => {
  try {
    // Fetch the authentication session
    const session = await fetchAuthSession();
    const token = session.tokens?.idToken?.toString();

    if (!token) {
      throw new Error("No token found");
    }

    // Set up the headers with the authorization token
    const headers = { Authorization: token };

    // Fetch the conversations
    const response = await fetch(`${baseUrl}/channels`, { headers });

    if (!response.ok) {
      throw new Error(`Fetch error: ${response.statusText}`);
    }

    // Parse the response data
    const data = await response.json();

    // Map the data to the Conversation type
    const conversations: Conversation[] = data.Items.map((c) => ({
      id: c.sessionid,
      title: c.History[0]?.data?.content || "NO TITLE SET",
      messages: c.History?.map((d) => ({
        id: makeid(5),
        content: d.data.content,
        from: d.data.type,
      })) ?? [{ id: c.sessionid, content: c.sessionid, from: "me" }],
    }));

    return conversations;
  } catch (error) {
    alert(`Error: ${error.message}`);
    // Return undefined to signify an error occurred
    return undefined;
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

export const getFiles = async (): Promise<FileUpload[]> => {
  var response = await client.models.File.list();
  const data = response.data.map((f) => ({
    id: f.id,
    isDone: f.isDone,
    path: f.path,
    createdAt: f.createdAt,
  }));
  return data;
};

export const createFileRecord = async (params) => {
  return client.models.File.create(params);
};

export const deleteFileRecord = async (params) => {
  return client.models.File.delete(params);
};
