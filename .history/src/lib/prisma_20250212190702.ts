import { PrismaClient } from "@prisma/client";

const prismaClientSinglton = () => {
    return new PrismaClient()
}

type prismaClientSinglton = ReturnType<typeof prismaClientSinglton>;

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined};

const prisma = globalForPrisma.prisma ?? prismaClientSinglton();

export default prisma

if (process.env.NODE_ENV !=="production") globalForPrisma.prisma = prisma;
*/



import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma?: PrismaClient };

export const prisma =
    globalForPrisma.prisma ||
    new PrismaClient({
        log: ["query", "info", "warn", "error"],
    });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
