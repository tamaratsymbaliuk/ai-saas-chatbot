/* Arslan's code

'use server'

import { client } from '@/lib/prisma'
import { currentUser } from '@clerk/nextjs/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET!, {
    typescript: true,
    apiVersion: '2025-01-27.acacia',
})

export const getUserClients = async () => {
    try {
        const user = await currentUser()
        if (user) {
            const clients = await client.customer.count({
                where: {
                    Domain: {
                        User: {
                            clerkId: user.id,
                        },
                    },
                },
            })
            if (clients) {
                return clients
            }
        }
    }
}
*/