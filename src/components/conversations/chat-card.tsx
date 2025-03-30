'use client'
import { useChatTime } from "@/hooks/conversation/use-conversation"
import React from 'react'
import { Card, CardContent, CardDescription } from "../ui/card"
import { Avatar, AvatarFallback } from '../ui/avatar'
import { User } from 'lucide-react'
import { UrgentIcon } from "@/icons/urgent-icon"

type Props = {
    title: string
    description?: string
    createdAt: Date
    id: string
    onChat(): void
    seen?: boolean
}

const ChatCard = ({
    title,
    description,
    createdAt,
    onChat,
    id,
    seen,
}: Props) => {
    const { messageSentAt, urgent } = useChatTime(createdAt, id)

    return (
        <Card
        onClick={onChat}
        className="rounded-none border-r-0 hover:bg-muted cursor-pointer transition durat"
    )

}
})