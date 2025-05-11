import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import PusherServer from "pusher";
import Pusher from "pusher-js";
import PusherClient from 'pusher-js'

// Utility function for merging Tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const extractUUIDFromString = (url: string) => {
  return url.match(
    /^[0-9a-f]{8}-?[0-9a-f]{4}-?[1-5][0-9a-f]{3}-?[89ab][0-9a-f]{3}-?[0-9a-f]{12}$/i
  )
}

// TODO: Create Pusher server client (for server actions)
export const pusherServer = new PusherServer({
  appId: process.env.NEXT_PUBLIC_PUSHER_APP_ID as string,
  key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY as string,
  secret: process.env.NEXT_PUBLIC_PUSHER_APP_SECRET as string,
  cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER as string,
  useTLS: true,
})

// TODO: Create Pusher client (for frontend realtime updates)
// export const pusherClient = new Pusher(
//   process.env.NEXT_PUBLIC_PUSHER_APP_KEY!,
//   {
//     cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER!,
//   }
// )
export const pusherClient = new PusherClient(
  process.env.NEXT_PUBLIC_PUSHER_APP_KEY as string,
  {
    cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER as string,
  }
)

export const postToParent = (message: string) => {
  window.parent.postMessage(message, '*')
}

export const extractURLfromString = (url: string) => {
  return url.match(/https?:\/\/[^\s"<>]+/)
}

export const extractEmailsFromString = (text: string) => {
  return text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi)
}

export const getMonthName = (month: number) => {
  return month == 1
    ? 'Jan'
    : month == 2
    ? 'Feb'
    : month == 3
    ? 'Mar'
    : month == 4
    ? 'Apr'
    : month == 5
    ? 'May'
    : month == 6
    ? 'Jun'
    : month == 7
    ? 'Jul'
    : month == 8
    ? 'Aug'
    : month == 9
    ? 'Sep'
    : month == 10
    ? 'Oct'
    : month == 11
    ? 'Nov'
    : month == 12 && 'Dec'
}
