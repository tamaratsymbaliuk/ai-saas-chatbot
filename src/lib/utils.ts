import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import PusherServer from "pusher";
import Pusher from "pusher-js";

// Utility function for merging Tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
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
export const pusherClient = new Pusher(
  process.env.NEXT_PUBLIC_PUSHER_APP_KEY!,
  {
    cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER!,
  }
)
