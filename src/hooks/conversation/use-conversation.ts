import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ConversationSearchSchema, ChatBotMessageSchema } from "@/schemas/conversation.schema";
import { onGetChatMessages, onGetDomainChatRooms, onGetActiveChatMessages, onOwnerSendMessage, onRealTimeChat, onViewUnReadMessages } from "@/actions/conversation";
import { useToast } from "@/hooks/use-toast";
import { useChatContext } from "@/context/use-chat-context";
import { getMonthName, pusherClient } from '@/lib/utils'
import { boolean, string } from "zod";

export const useConversation = () => {
  // Set up state for loading, chat rooms, and messages

  const { register, watch } = useForm({
    resolver: zodResolver(ConversationSearchSchema),
    mode: 'onChange',
  })
  const { setLoading: loadMessages, setChats, setChatRoom, chats } = useChatContext()
  const [chatRooms, setChatRooms] = useState<
  {
    chatRoom: {
      id: string
      createdAt: Date
      message: {
        message: string
        createdAt: Date
        seen: boolean
      }[]
    }[]
    email: string | null
  }[]
  >([])
  const [loading, setLoading] = useState<boolean>(false)
  useEffect(() => {
    const search = watch(async (value) => {
      setLoading(true)
      console.log('value', value)
      try {
        const rooms = await onGetDomainChatRooms(value.domain)
        console.log('rooms', rooms)
        if (rooms) {
          setLoading(false)
          setChatRooms(rooms.customers)
        }
      } catch(error) {
        console.log(error)
      }
    })
    return () => search.unsubscribe()
  }, [watch])

  const onGetActiveChatMessages = async (id: string) => {
    try {
      loadMessages(true)
      const messages = await onGetChatMessages(id)
      if (messages) {
        setChatRoom(id)
        loadMessages(false)
        setChats(messages[0].message)
      }
    } catch (error) {
      console.log(error)
    }
  }
  console.log("chats hook", chats)
  console.log("chatRooms hook", chatRooms)
  return {
    register,
    chatRooms,
    loading,
    onGetActiveChatMessages
  }
}

export const useChatTime = (createdAt: Date, roomId: string) => {
  const { chatRoom } = useChatContext()
  const [messageSentAt, setMessageSentAt] = useState<string>()
  const [urgent, setUrgent] = useState<boolean>(false)

  const onSetMessageRecievedDate = () => {
    const dt = new Date(createdAt)
    const current = new Date()
    const currentDate = current.getDate()
    const hr = dt.getHours()
    const min = dt.getMinutes()
    const date = dt.getDate()
    const month = dt.getMonth()
    const difference = currentDate - date
    
    if (difference <= 0) {
      setMessageSentAt(`${hr}:${min}${hr > 12 ? 'PM' : 'AM'}`)
      if (current.getHours() - dt.getHours() < 2) {
        setUrgent(true)
      }
    } else {
      setMessageSentAt(`${date} ${getMonthName(month)}`)
    }
  }
  const onSeenChat = async () => {
    if (chatRoom == roomId && urgent) {
      await onViewUnReadMessages(roomId)
      setUrgent(false)
    }
  }

  useEffect(() => {
    onSeenChat()
  }, [chatRoom])

  useEffect(() => {
    onSetMessageRecievedDate()
  }, [])
  return { messageSentAt, urgent, onSeenChat }
}

export const useChatWindow = () => {
  const { chats, loading, setChats, chatRoom } = useChatContext()
  const messageWindowRef = useRef<HTMLDivElement | null>(null)
  const { register, handleSubmit, reset } = useForm({
    resolver: zodResolver(ChatBotMessageSchema),
    mode: 'onChange',
  })
  const onScrollToBottom = () => {
    messageWindowRef.current?.scroll({
      top: messageWindowRef.current.scrollHeight,
      left: 0,
      behavior: 'smooth',
    })
  }
  useEffect(() => {
    onScrollToBottom()
  }, [chats, messageWindowRef])

  useEffect(() => {
    if (chatRoom) {
      pusherClient.subscribe(chatRoom)
      pusherClient.bind('realtime-mode', (data: any) => {
        setChats((prev) => [...prev, data.chat])
      })

      return () => {
        pusherClient.unbind('realtime-mode')
        pusherClient.unsubscribe(chatRoom)
      }
    }
  }, [chatRoom])

  const onHandleSentMessage = handleSubmit(async (values) => {
    try {
      reset()
      const message = await onOwnerSendMessage(
        chatRoom!,
        values.content,
        'ADMIN'
      )
      if (message) {

        await onRealTimeChat(
          chatRoom!,
          message.messages[0].message,
          message.messages[0].id,
          'ADMIN'
        )
      }
    } catch (error) {
      console.log(error)
    }
  })

  return {
    messageWindowRef,
    register,
    onHandleSentMessage,
    chats,
    loading,
    chatRoom
  }

}



// type ChatMessage = {
//   id: string;
//   message: string;
//   role: "USER" | "ADMIN" | "SUPPORT";
//   createdAt: Date;
//   updatedAt: Date;
//   chatRoomId: string;
//   seen: boolean;
// };

// type ChatRoom = {
//   id: string;
// };

// export const useConversation = () => {
//   // Set up state for loading, chat rooms, and messages
//   const [loading, setLoading] = useState<boolean>(false);
//   const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
//   const [messages, setMessages] = useState<ChatMessage[]>([]);
//   const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);

//   // Set up react-hook-form with ConversationSearchSchema for domain input
//   const { register, handleSubmit, watch } = useForm<ConversationSearchInput>({
//     resolver: zodResolver(ConversationSearchSchema),
//   });

//   // Watch domain input from form
//   const domainInput = watch("domain");  // Change from "name" to "domain"

//   // Set up toast for displaying error or success messages
//   const { toast } = useToast();

//   // Fetch chat rooms based on domain input
//   useEffect(() => {
//     const fetchChatRooms = async () => {
//       if (domainInput) {
//         setLoading(true);
//         try {
//           const rooms = await onGetDomainChatRooms(domainInput);
//           setChatRooms(rooms);  // Update state with fetched chat rooms
//         } catch (error) {
//           console.error("Error fetching chat rooms:", error);
//           toast({ title: "Error", description: "Failed to fetch chat rooms"});
//         } finally {
//           setLoading(false);
//         }
//       }
//     };

//     fetchChatRooms();
//   }, [domainInput]);  // Re-run when domain input changes

//   // Fetch active chat messages when a chat room is selected
//   const handleRoomSelect = async (roomId: string) => {
//     setSelectedRoomId(roomId);
//     setLoading(true);
//     try {
//       const activeMessages = await onGetActiveChatMessages(roomId);
//       setMessages(activeMessages);  // Update state with active messages
//     } catch (error) {
//       console.error("Error fetching active messages:", error);
//       toast({ title: "Error", description: "Failed to fetch active messages"});
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle domain form submission (for logging or further use)
//   const onSubmit = (data: ConversationSearchInput) => {
//     console.log("Domain submitted:", data);
//   };

//   return {
//     loading,
//     chatRooms,
//     messages,
//     selectedRoomId,
//     register,
//     handleSubmit: handleSubmit(onSubmit),
//     onRoomSelect: handleRoomSelect,
//   };
// };



// export const useConversation = () => {
//   // Setup useForm with ConversationSearchSchema
//   const {
//     register,
//     handleSubmit,
//     watch,
//     formState: { errors },
//   } = useForm<ConversationSearchInput>({
//     resolver: zodResolver(ConversationSearchSchema),
//   });

//   const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
//   const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
//   const [messages, setMessages] = useState<ChatMessage[]>([]);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [roomLoading, setRoomLoading] = useState<boolean>(false);
//   const { toast } = useToast();

//   const domain = watch("domain");

//   // Fetch chat rooms when domain changes
//   useEffect(() => {
//     if (domain) {
//       setRoomLoading(true);
//       onGetDomainChatRooms(domain)
//         .then((rooms) => {
//           setChatRooms(rooms);
//           setRoomLoading(false);
//         })
//         .catch((error) => {
//           setRoomLoading(false);
//           toast({ title: "Error", description: "Failed to fetch chat rooms." });
//         });
//     }
//   }, [domain]);

//   // Fetch active chat messages when a room is selected
//   useEffect(() => {
//     if (selectedRoom) {
//       setLoading(true);
//       onGetActiveChatMessages(selectedRoom.id)
//         .then((messages) => {
//           setMessages(messages);
//           setLoading(false);
//         })
//         .catch((error) => {
//           setLoading(false);
//           toast({ title: "Error", description: "Failed to load messages." });
//         });
//     }
//   }, [selectedRoom]);

//   const handleRoomSelection = (room: ChatRoom) => {
//     setSelectedRoom(room);
//   };

//   const onSubmit = async (data: ConversationSearchInput) => {
//     // No additional submission logic needed unless you're posting something to the backend
//   };

//   return {
//     register,
//     handleSubmit,
//     chatRooms,
//     messages,
//     loading,
//     roomLoading,
//     selectedRoom,
//     errors,
//     handleRoomSelection,
//     onSubmit,
//   };
// };
