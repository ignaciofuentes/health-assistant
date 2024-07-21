interface Conversation {
  id: string;
  title: string;
}

interface Message {
  id: string;
  content: string;
  conversationId: string;
}
