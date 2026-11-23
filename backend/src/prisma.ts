import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
dotenv.config();

const rawUrl =
  process.env.DATABASE_URL_POOLED ||
  process.env.DATABASE_URL ||
  'postgresql://neondb_owner:npg_2XhIVRtx8Wwu@ep-orange-paper-bcwcy672-pooler.c-16.us-east-1.aws.neon.tech/neondb?sslmode=require';

// Neon Serverless fix: Ensure pooled connection is always used and clean incompatible parameters
let cleanUrl = rawUrl.replace('&channel_binding=require', '').replace('channel_binding=require&', '');
if (cleanUrl.includes('ep-orange-paper-bcwcy672.') && !cleanUrl.includes('ep-orange-paper-bcwcy672-pooler.')) {
  cleanUrl = cleanUrl.replace('ep-orange-paper-bcwcy672.', 'ep-orange-paper-bcwcy672-pooler.');
}

export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: cleanUrl,
    },
  },
});

