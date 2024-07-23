interface Conversation {
  id: string;
  title: string;
  messages: Message[];
}

interface Message {
  id: string;
  content: string;
  conversationId: string;
  from: string;
}

interface FileUpload {
  id: string;
  path: string | null;
  isDone: boolean | null;
  createdAt: string;
}
