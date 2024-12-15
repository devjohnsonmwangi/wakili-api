import {Hono} from 'hono';
import { zValidator } from '@hono/zod-validator';
import { createUserValidator, loginUserValidator } from '../validators/user.validator';
import { loginUser, createUser, updateUserPicture } from './auth.controller';

export const authRouter = new Hono();

authRouter.post('/auth/register', zValidator('json',createUserValidator,(result,c)=>{    if(!result.success) return c.text( result.error.message + "😒",400)}),createUser);

authRouter.post('/auth/login', zValidator('json',loginUserValidator,(result,c)=>{    if(!result.success) return c.text( result.error.message + "😒",400)}),loginUser);

authRouter.get('/auth/updateUserPicture', updateUserPicture);