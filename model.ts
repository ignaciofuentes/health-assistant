interface Conversation {
  id: string;
  title: string;
  messages: Message[];
}

interface Message {
  id: string;
  content: string;
  conversationId: string;
}
