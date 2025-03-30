import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChatMessageSchema } from "../schemas/conversation.schema";
import { onOwnerSendMessage, onRealTimeChat } from "../actions/conversation";
import Pusher from "pusher-js";
import { pusherClient } from "../lib/utils";

export const useChatWindow = (chatRoomId) => {
  const [messages, setMessages] = useState([]);
  const chatEndRef = useRef(null);

  // 1. Setup useForm with ChatBotMessageSchema
  const { register, handleSubmit, reset } = useForm({
    resolver: zodResolver(ChatMessageSchema),
  });

  // 2. On submit: send + broadcast message
  const onSubmit = async (data) => {
    try {
      const newMessage = await onOwnerSendMessage(chatRoomId, data.message);
      setMessages((prev) => [...prev, newMessage]);
      onRealTimeChat(chatRoomId, newMessage);
      reset();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // 3. Subscribe to chatRoom via Pusher
  useEffect(() => {
    if (!chatRoomId) return;
    
    const channel = pusherClient.subscribe(`chatRoom-${chatRoomId}`);
    channel.bind("new-message", (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
    });

    return () => {
      channel.unbind_all();
      pusherClient.unsubscribe(`chatRoom-${chatRoomId}`);
    };
  }, [chatRoomId]);

  // 4. Scroll to bottom on every new message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return {
    messages,
    register,
    handleSubmit: handleSubmit(onSubmit),
    chatEndRef,
  };
};