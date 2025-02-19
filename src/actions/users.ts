"use server";

import prisma from "@/lib/prisma";
import { User } from "@prisma/client";

interface CreateUserInput {
    fullname: string;
    clerkId: string;
    type: string;
    stripeId: string;
}

export async function createUserInDB({
    fullname,
    clerkId,
    type,
    stripeId
}: CreateUserInput): Promise<User> {
    const existingUser = await prisma.user.findUnique({
        where: { clerkId },
    });

    if (existingUser) {
        return existingUser;
    }

    const newUser = await prisma.user.create({
        data: {
            fullname,
            clerkId,
            type,
            stripeId,
        },
    });

    return newUser;
}


/* youtobe code

export async function getUsers(limit?: number) { 
    try {
        const users = await prisma.user.findMany({
            orderBy: {
                fullname: 'asc'
            },
            ...(limit ? { take: limit } : {})
        })
        return { users }
    } catch (error) {
        return { error }
    } 
}

export async function createUser(data: User) {
    try {
        const user = await prisma.user.create({ data })
        return { user }
    } catch (error) {
        return { error }
    }
}

export async function getUserById({
    id, clerkId } : {
        id?: string
        clerkId?: string
    }) {
        try {
            if (!id && clerkId) {
                throw new Error('id or clerkId is required')
            }

            const query = id ? { id } : { clerkId }

            const user = await prisma.user.findUnique({ where: query })
            return { user }  
        } catch (error) {
            return { error }
        }
    }



    export async function deleteUser(id: string) {
        try {
            const user = await prisma.user.delete({
                where: { clerkId: id}
            })
             return { user }
        } catch (error) {
            return { error }
        } 
    }
    */
    
    
    /*
    export async function getUserByEmail(email: string) {
        try {
            const user = await prisma.user.findUnique({
                where: { email }
            })
            return { user }
        } catch (error) {
            return { error }
        }
    }
    */
