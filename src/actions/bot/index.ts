'use server'

import prisma from '@/lib/prisma'
import { extractEmailsFromString, extractURLfromString } from '@/lib/utils'
import { onRealTimeChat } from '../conversation'
import { auth, clerkClient} from '@clerk/nextjs/server'
import { onMailer } from '../mailer'
import OpenAi from 'openai'
import { checkCustomRoutes } from 'next/dist/lib/load-custom-routes'
import { it } from 'node:test'
import { Chathura, Sassy_Frass } from 'next/font/google'
import { messageInRaw } from 'svix'
import { time } from 'console'
import EmailMarketingPage from '@/app/(dashboard)/email-marketing/page'

const openai = new OpenAi({
    apiKey: process.env.OPEN_AI_KEY,
})

export const onStoreConversations = async (
    id: string,
    message: string,
    role: 'ADMIN' | 'USER'
) => {
    await prisma.chatRoom.update({
        where: {
            id,
        },
        data: {
            messages: {
                create: {
                    message,
                    role,
                },
            },
        },
    })
}

export const onGetCurrentChatBot = async (id: string) => {
    try {
        const chatbot = await prisma.domain.findUnique({
            where: {
                id,
            },
            select: {
                helpdesk: true,
                name: true,
                chatBot: {
                    select: {
                        id: true,
                        welcomeMessage: true,
                        icon: true,
                        textColor: true,
                        background: true,
                        helpdesk: true,
                    },
                },
            },
        })
 
        if (chatbot) {
            return chatbot
        }
    } catch (error) {
        console.log(error)
    }
}

let customerEmail: string | undefined

export const onAiChatBotAssistant = async (
    id: string,
    chat: { role: 'ADMIN' | 'USER'; content: string } [],
    author: 'USER',
    message: string
) => {
    try {
        const chatBotDomain = await prisma.domain.findUnique({
            where: {
                id,
            },
            select: {
                name: true,
                filterQuestions: {
                    where: {
                        answered: null,
                    },
                    select: {
                        question: true,
                    },
                },
            },
        })
        if (chatBotDomain) {
            const extractedEmail = extractEmailsFromString(message)
            if (extractedEmail) {
                customerEmail = extractedEmail[0]
            }

            if (customerEmail) {
                const checkCustomer = await prisma.domain.findUnique({
                    where: {
                        id,
                    },
                    select: {
                        user: {
                            select: {
                                clerkId: true,
                            },
                        },
                        name: true,
                        customers: {
                            where: {
                                email: {
                                    startsWith: customerEmail,
                                },
                            },
                            select: {
                                id: true,
                                email: true,
                                questions: true,
                                chatRoom: {
                                    select: {
                                        id: true,
                                        live: true,
                                        mailed: true,
                                    },
                                },
                            },
                        },
                    },
                })
                if (checkCustomer && !checkCustomer.customer.length) {
                    const newCustomer = await prisma.domain.update({
                        where: {
                            id,
                        },
                        data: {
                            customers: {
                                create: {
                                    email: customerEmail,
                                    questions: {
                                        create: chatBotDomain.filterQuestions,
                                    },
                                    chatRoom: {
                                        create: {},
                                    },
                                },
                            },
                        },
                    })
                    if (newCustomer) {
                        console.log('new customer made')
                        const response = {
                            role: 'ADMIN',
                            content: 'Welcome aboard ${
                                customerEmail.split['@']}
                            )! I'm glad to connect with you. Is there anything you need help with ?',
                        }
                        return { response }
                    }
                }
                if (checkCustomer && checkCustomer.customers[0].chatRoom[0].live) {
                    await onStoreConversations{
                        checkCustomer?.customer[0].chatRoom[0].id,
                        message, 
                        author
                    }

                    onRealTimeChat{
                        checkCustomer.customer[0].chatRoom[0].id,
                        message,
                        'USER',
                        author
                    }

                    if (!checkCustomer.customer[0].chatRoom[0].mailed) {
                        const user = await clerkClient[0].users.getUser{
                            checkCustomer.user?.clerkId
                        }

                        onMailer(user.emailAddress[0].emailAddress)

                        // update mail status to prevent spamming
                        const mailed = await prisma.chatRoom.update({
                            where: {
                                id: checkCustomer.customer[0].chatRoom[0].id,
                            },
                            date: {
                                mailed: true,
                            },
                        })

                        if (mailed) {
                            return {
                                live: true,
                                chatRoom: checkCustomer.customer[0].chatRoom[0].id,
                            }
                        }
                    }
                    return {
                        live: true,
                        chatRoom: checkCustomer.customer[0].chatRoom[0].id,
                    }
                }

                    await onStoreConversations(
                        checkCustomer?.customer[0].chatRoom[0].id!,
                        message,
                        author
                    )

                    const chatCompletion = await openai.chat.completions.create({
                        messages: [
                            {
                                role: 'ADMIN',
                                content: `
                                You will get an array of questions that you must ask the customerEmail,

                                Progreess the conversation using those questions.

                                Whenever you ask a question from the array need you to add a keyword at 

                                Do not forget it.

                                only add this keyword when your asking a question from the array of question 
                                
                                Always maintain character and stay respectfull

                                The array of questions : [${chatBotDomain.filterQuestions
                                .map((questions) => questions.question)
                            .join(', ')}]

                            if the customer says something out of cintext or inappropriate. Simply 

                            if the customer agrees to book an appoitment send them this link
                            checkCustomer?.customer[0].id
                            }
                            if the customer wasnts to buy a product redirect them to the payment page
                            checkCustomer?.customer[0].id`
                    },
                    ,
                ],
                ...chat,
                {
                    role: 'USER',
                    content: message,
                },
            ],
            model: 'gpt-3.5-turbo',
                })

                if (chatCompletion.choices[0].message.content?.includes('(realtime')) {
                    const realtime =  await prisma.chatRoom.update({
                        where: {
                            id: checkCustomer?.customer[0].chatRoom[0].id,
                        },
                        data: {
                            live: true,
                        },
                    })

                    if (realtime) {
                        const response = {
                            role: 'ADMIN',
                            content: chatCompletion.choices[0].message.content.replace('(realtime)',
                            ''
                            ),
                    }
                    await onStoreConversations(
                        checkCustomer?.cuswtomer[0].chatRoom[0].id!,
                        response.content,
                        'ADMIN'
                    )

                    return { response }
                }
            }
            if (chat[chat.length - 1].content.includes('(complete)')) {
                const firstUnansweredQuestion = 
                await prisma.customerResponse.findFirst({
                    where: {
                        customerId: checkCustomer?.customer[0].id,
                        answered: null,
                    },
                    select: {
                        id: true,
                    },
                    orderBy: {
                        question: 'asc',
                    },
                })
                    if (firstUnansweredQuestion) {
                        await prisma.customerResponse.update({
                            where: {
                                id: firstUnansweredQuestion.id,
                            },
                    data: {
                        answered: message,
                    },
                })
            }
        }
        if (chatCompletion) {
            const generatedLink = extractURLfromString(
                chatCompletion.choices[0].message.content as string
            )

            if (generatedLink) {
                const link = generatedLink[0]
                const response = {
                    role: 'ADMIN',
                    content: `Great! you can follow the link to proceed`,
                    link: link.slice(0, -1),
                }

                await onStoreConversations(
                checkCustomer?.customer[0].chatRoom[0].id!,
                `${response.content} ${response.link}`,
                'USER'
            )

            return { response }
        }

        const response = {
            role: 'ADMIN',
            content: chatCompletion.choices[0].message.content,
        }

        await onStoreConversations(
            checkCustomer?.customer[0].chatRoom[0].id!,
            `${response.content}`,
            'ADMIN'
        )

        return { response }
    }
}

console.log('No customer')
const chatCompletion = await openai.chat.completions.create({
    messages: [
        {
            role: 'ADMIN',
            content: `
            You are a highly knowledgable and experienced sales representative for a 
            Right now you are talking to a customer for the first time. Start by giving 
            
            Your next task is lead the conversation naturally to get the customers Email`,
        },
        ...chat,
        {
            role: 'USER',
            content: message,
        },
    ],
    model: 'gpt-3.5-turbo',
})
if (chatCompletion) {
    const response = {
        role: 'ADMIN',
        content: chatCompletion.choices[0].message.content,
    }
    return { response }
}
}
} catch (error) {
    console.log(error)
}
}
