import * as dotenv from 'dotenv';
dotenv.config();

if (!process.env.SECRET_KEY) {
  throw new Error('SECRET_KEY is not defined in environment variables');
}

export const jwtConstants = {
  secret: process.env.SECRET_KEY as string,
};
