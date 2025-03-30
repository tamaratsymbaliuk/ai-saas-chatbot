'use client'

import React, {createContext, useContext, useState } from 'react'

type ChatInitialValuesProps = {
  realtime: boolean
  setRealtime: React.Dispatch<React.SetStateAction<boolean>>
  chatRoom: string | undefined
  setChatRoom: React.Dispatch<React.SetStateAction<string | undefined>>
  chats: {
    message: string
    role: 'ADMIN' | 'USER' | null
    createdAt: Date
    seen: boolean
  }[]
  setChats: React.Dispatch<
  React.SetStateAction<
  {
    message: string
    id: string
    role: 'ADMIN' | 'USER' | null
    createdAt: Date
    seen: boolean
  }[]
 >
>
loading: boolean
setLoading: React.Dispatch<React.SetStateAction<boolean>>
}

const ChatInitialValues: ChatInitialValuesProps = {
  chatRoom: undefined,
  setChatRoom: () => undefined,
  chats: [],
  setChats: () => undefined,
  loading: false,
  setLoading: () => undefined,
  realtime: false,
  setRealtime: () => undefined,
}

const chatContext = createContext(ChatInitialValues)
const { Provider } = chatContext

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [chats, setChats] = useState(ChatInitialValues.chats);
  const [loading, setLoading] = useState(ChatInitialValues.loading);
  const [chatRoom, setChatRoom] = useState(ChatInitialValues.chatRoom);
  const [realtime, setRealtime] = useState(ChatInitialValues.realtime);

  const values = {
    chats,
    setChats,
    loading,
    setLoading,
    chatRoom,
    setChatRoom, 
    realtime,
    setRealtime,
  }

  return <Provider value={values}>{children}</Provider>
}

export const useChatContext = () => {
  const state = useContext(chatContext)
  return state
}



// import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
// import { ChatRoom, ChatMessage, Role } from '@prisma/client'; 
// import { onGetChatMessages, onToggleRealtime, onOwnerSendMessage } from '@/actions/conversation'; // Server actions

// interface ChatContextType {
//   chatRoom: ChatRoom | null;
//   chats: ChatMessage[];
//   loading: boolean;
//   realtime: boolean;
//   setChatRoom: (chatRoom: ChatRoom) => void;
//   setChats: (chats: ChatMessage[]) => void;
//   setLoading: (loading: boolean) => void;
//   toggleRealtime: () => void;
//   sendMessage: (message: string, role: 'USER' | 'ADMIN') => Promise<void>;
// }

// const ChatContext = createContext<ChatContextType | undefined>(undefined);

// interface ChatProviderProps {
//   children: ReactNode;
// }

// export const ChatProvider = ({ children }: ChatProviderProps) => {
//   const [chatRoom, setChatRoom] = useState<ChatRoom | null>(null);
//   const [chats, setChats] = useState<ChatMessage[]>([]);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [realtime, setRealtime] = useState<boolean>(false);

//   // Fetch chat messages when chat room is set
//   useEffect(() => {
//     if (chatRoom?.id) {
//       setLoading(true);
//       onGetChatMessages(chatRoom.id).then((messages) => {
//         setChats(messages);
//         setLoading(false);
//       });
//     }
//   }, [chatRoom]);

//   const toggleRealtime = async () => {
//     if (chatRoom?.id) {
//       const updatedRealtime = !realtime;
//       await onToggleRealtime(chatRoom.id, updatedRealtime);
//       setRealtime(updatedRealtime);
//     }
//   };

//   const sendMessage = async (message: string, role: 'USER' | 'ADMIN') => {
//     if (chatRoom?.id) {
//       await onOwnerSendMessage(chatRoom.id, message, role);
//       const newMessage: Partial<ChatMessage> = {
//       message,
//       role,
//       chatRoomId: chatRoom.id,
//       seen: false, // seen will default to false 
//     };

//     // Add the new message to the state
//     setChats((prevChats) => [...prevChats, newMessage as ChatMessage]); // Type assertion to ChatMessage
//   }
// };

//   return (
//     <ChatContext.Provider
//       value={{
//         chatRoom,
//         chats,
//         loading,
//         realtime,
//         setChatRoom,
//         setChats,
//         setLoading,
//         toggleRealtime,
//         sendMessage,
//       }}
//     >
//       {children}
//     </ChatContext.Provider>
//   );
// };

// // Custom hook to access the chat context
// export const useChatContext = (): ChatContextType => {
//   const context = useContext(ChatContext);
//   if (!context) {
//     throw new Error('useChatContext must be used within a ChatProvider');
//   }
//   return context;
// };
