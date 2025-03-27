import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv'

// Load .env.local before anything else
dotenv.config({ path: '.env.local' })
const prisma = new PrismaClient();
export default prisma;