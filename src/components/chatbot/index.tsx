'use client'
import { useChatBot } from '@/hooks/chatbot/use-chatbot'
import React from 'react'
import { BotWindow } from './window'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { BotIcon } from '@/icons/bot-icon'


const AiChatBot = () => {
    const {
        onOpenChatBot,
        botOpened,
        onChats,
        register,
        onStartChatting,
        onAiTyping,
        messageWindowRef,
        currentBot,
        loading,
        onRealTime,
        setOnChats,
        errors,
    } = useChatBot()

    return (
        <div className="h-screen flex flex-col justify-end items-end gap-4">
            {botOpened && (
                <BotWindow
                errors={errors}
                setChat={setOnChats}
                realtimeMode={onRealTime}
                helpdesk={currentBot?.helpdesk!}
                domainName={currentBot?.name!}
                ref={messageWindowRef}
                help={currentBot?.chatBot?.helpdesk}
                theme={currentBot?.chatBot?.textColor}
                chats={onChats}
                register={register}
                onChat={onStartChatting}
                onResponding={onAiTyping}
              />
            )}
            <div
            className={cn(
                'rounded-full relative cursor-pointer shadow-md w-20 h-20 flex items-center'
                loading ? 'invisible' : 'visible'
            )}
            onClick={onOpenChatBot}
            >
                {currentBot?.chatBot?.icon ? (
                    <Image
                    src={`https://ucarecdn.com/${currentBot.chatBot.icon}/`}
                    alt="bot"
                    fill
                    className="rounded-full"
                    />
                ) : (
                    <BotIcon />
                )}
            </div>
        </div>
    )
}
export default AiChatBot