import prisma from '@/lib/prisma'
import { User } from '@prisma/client'
import exp from 'constants'

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
    
    
    
