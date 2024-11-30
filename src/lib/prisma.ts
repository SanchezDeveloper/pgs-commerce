/*import { PrismaClient } from "@prisma/client";

declare global {
    var prisma: PrismaClient | undefined;
}

const prisma = global.prisma || new PrismaClient();

if(process.env.NODE_ENV === "development") global.prisma = prisma;

export default prisma;*/

import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as typeof globalThis & {
    prisma?: PrismaClient;
};

const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV === "development") {
    globalForPrisma.prisma = prisma;
}

export default prisma;