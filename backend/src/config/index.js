import { config } from 'dotenv';

if (process.env.NODE_ENV !== 'producction') config();

export const PORT = process.env.PORT || 3300;
export const SECRETORPRIVATEKEY_JWT = process.env.SECRETORPRIVATEKEY_JWT;
