import { Webhook } from 'svix';
import { headers } from 'next/headers'
//import { Client } from '@upstash/qstash'
import { revalidatePath } from 'next/cache';
import { WebhookEvent } from '@clerk/nextjs/server';

import { User } from '@prisma/client'
import { createUser } from '@/lib/users'

//const qstashClient = new Client({ token: process.env.QSTASH_TOKEN as string})

export async function POST(req: Request) {
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

    if (!WEBHOOK_SECRET) {
        throw new Error(
            'Please add WEBHOOK_SECRET from CLERK Dashboard to .env or .env.local'
        )
    }
    const headerPayload = headers()
    const svix_id = headerPayload.get('svix-id')



    
}
