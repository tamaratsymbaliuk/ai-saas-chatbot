import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { WebhookEvent } from '@clerk/nextjs/server';

import { createUserInDB } from '@/actions/users';

export async function POST(req: Request) {
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

    if (!WEBHOOK_SECRET) {
        throw new Error('Error: Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local');
    }

    const wh = new Webhook(WEBHOOK_SECRET);
    const headerPayload = await headers();
    const svix_id = headerPayload.get('svix-id');
    const svix_timestamp = headerPayload.get('svix-timestamp');
    const svix_signature = headerPayload.get('svix-signature');

    if (!svix_id || !svix_timestamp || !svix_signature) {
        return new Response('Error: Missing Svix headers', { status: 400 });
    }

    const payload = await req.json();
    const body = JSON.stringify(payload);

    let evt: WebhookEvent;

    try {
        evt = wh.verify(body, {
            'svix-id': svix_id,
            'svix-timestamp': svix_timestamp,
            'svix-signature': svix_signature,
        }) as WebhookEvent;
    } catch (err) {
        console.error('Error: Could not verify webhook:', err);
        return new Response('Error: Verification error', { status: 400 });
    }

    if (typeof evt.data !== 'object' || evt.data === null) {
        return new Response('Error: Invalid event data', { status: 400 });
    }

    const { id, first_name, last_name } = evt.data as { id: string; first_name?: string; last_name?: string };
    const eventType = evt.type;

    console.log(`Received webhook with ID ${id} and event type of ${eventType}`);
    console.log('Webhook payload:', body);

    if (eventType === 'user.created') {
        if (!id) {
            return new Response('Error occurred -- missing data', { status: 400 });
        }

        try {
            const userFromDB = await createUserInDB({
                clerkId: id,
                fullname: `${first_name || ""} ${last_name || ""}`.trim(),
                type: "default",
                stripeId: "",
            });

            if (!userFromDB) {
                throw new Error("Failed to create user");
            }

            revalidatePath('/');
            return new Response('Webhook received and user created', { status: 200 });
        } catch (error) {
            console.error('Error creating user:', error);
            return new Response('Error occurred while creating user', { status: 500 });
        }
    }

    return new Response('Webhook received', { status: 200 });
}




/*import { Webhook } from 'svix';
import { headers } from 'next/headers'
//import { Client } from '@upstash/qstash'
import { revalidatePath } from 'next/cache';
import { WebhookEvent } from '@clerk/nextjs/server';

import { User } from '@prisma/client'
import { createUser } from '@/actions/users' //updated path in tsconfig.json


//const qstashClient = new Client({ token: process.env.QSTASH_TOKEN as string})

export async function POST(req: Request) {
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

    if (!WEBHOOK_SECRET) {
       throw new Error('Error: Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local')
  }

  // Create new Svix instance with secret
  const wh = new Webhook(WEBHOOK_SECRET)

  // Get headers
  const headerPayload = await headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error: Missing Svix headers', {
      status: 400,
    })
  }

  // Get body
  const payload = await req.json()
  const body = JSON.stringify(payload)

  let evt: WebhookEvent

  // Verify payload with headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error: Could not verify webhook:', err)
    return new Response('Error: Verification error', {
      status: 400,
    })
  }

  // Do something with payload
  // For this guide, log payload to console
  const { id } = evt.data
  const eventType = evt.type
  console.log(`Received webhook with ID ${id} and event type of ${eventType}`)
  console.log('Webhook payload:', body)

  if (eventType === 'user.created') {
      const { id, first_name, last_name } = evt.data

      if (!id) {
          return new Response('Error occured -- missing data', {
              status: 400
          })
      }

      const user = {
          clerkId: id, 
          fullname: `${first_name || ""} ${last_name || ""}`.trim()
      }

      try {
          const { user: userFromDB, error } = await createUser(user as User)
          if (error) throw error
          revalidatePath('/')        
      } catch (error) {
          return new Response('Error occured', {
              status: 400
          })
      }

  return new Response('Webhook received', { status: 200 })
}
}



*/

