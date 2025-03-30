"use server";

import prisma  from "@/lib/prisma"; 
import { pusherServer } from "@/lib/utils"; 

// Toggle real-time mode for a chatroom
export const onToggleRealtime = async (id: string, state: boolean) => {
  try {
    const chatRoom = await prisma.chatRoom.update({
      where: {
        id,
      },
      data: {
        live: state,
      },
      select: {
        id: true,
        live: true,
      },
    })
    if (chatRoom) {
      return {
        status: 200,
        message: chatRoom.live
        ? 'Realtime mode enabled'
        : 'Realtime mode disabled',
        chatRoom,
      }
    }
  } catch (error) {
    console.log(error)
  } 
}
// Get the real-time status of a chatroom
export const onGetConversationMode = async (id: string) => {
  try {
    const mode = await prisma.chatRoom.findUnique({
      where: {
        id,
      },
      select: {
        live: true,
      },
    })
    console.log(mode)
    return mode
  } catch (error) {
     console.log(error)
  }
} 
// Get all chat rooms for a domain
export const onGetDomainChatRooms = async (id: string) => {
  try {
    const domains = await prisma.domain.findUnique({
      where: {
        id,
      },
      select: {
        customers: {
          select: {
            email: true,
            chatRooms: {
              select: {
                createdAt: true,
                id: true,
                messages: {
                  select: {
                    message: true,
                    createdAt: true,
                    seen: true,
                  },
                  orderBy: {
                    createdAt: 'desc',
                  },
                  take: 1,
                },
              },
            },
          },
        },
      },
    })

    if (domains) {
      return domains
    }
  } catch (error) {
    console.log(error)
  }
}
// Fetch messages for a chatroom
export const onGetChatMessages = async (id: string) => {
  try {
    const messages = await prisma.chatRoom.findMany({
      where: {
        id,
      },
      select: {
        id: true,
        live: true,
        messages: {
          select: {
            id: true,
            role: true,
            message: true,
            createdAt: true,
            seen: true,
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    })

    if (messages) {
      return messages
    }
  } catch (error) {
    console.log(error)
  }
}
  

// Mark all unread messages as seen in a chatroom
export const onViewUnReadMessages = async (id: string) => {
  try {
    await prisma.chatMessage.updateMany({
      where: {
        chatRoomId: id,
      },
      data: {
        seen: true,
      },
    })
  } catch (error) {
    console.log(error)
  }
}
// Real-time chat using Pusher
export const onRealTimeChat = async (
  chatroomId: string,
  message: string,
  id: string,
  role: 'ADMIN' | 'SUPPORT'
) => {
  pusherServer.trigger(chatroomId, 'realtime-mode', {
    chat: {
      message,
      id,
      role,
    },
  })
}
// Owner sends a message
export const onOwnerSendMessage = async (
  chatroom: string,
  message: string,
  role: 'USER' | 'ADMIN'
) => {
  try {
    const chat = await prisma.chatRoom.update({
      where: {
        id: chatroom,
      },
      data: {
        messages: {
          create: {
            message,
            role,
          },
        },
      },
      select: {
        messages: {
          select:{
            id: true,
            message: true,
            role: true,
            createdAt: true,
          },
  orderBy: {
    createdAt: 'desc',
  },
  take: 1,
},
},
})

if (chat) {
  return chat
}
} catch (error) {
  console.log(error)
}
}

 



export const onGetActiveChatMessages = async (roomId: string) => {
  return await prisma.chatMessage.findMany({
    where: {
      chatRoomId: roomId,
      seen: false,  // Only get unread messages (active)
    },
    orderBy: {
      createdAt: 'asc',  // Order by creation time
    },
  });
};