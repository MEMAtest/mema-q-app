import { PrismaClient } from '@prisma/client';

// Singleton pattern for Prisma Client to prevent connection pool exhaustion
// in serverless environments (Vercel, AWS Lambda, etc.)
const globalForPrisma = globalThis;

const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;