import { z } from 'zod';

export const createUserValidator = z.object({
    full_name: z.string(),
    email: z.string(),
    password: z.string(),
    phone_number: z.string(),
    address: z.string(),
});

export const loginUserValidator = z.object({
    email: z.string(),
    password: z.string()
});

export const updateUserValidator = z.object({
    full_name: z.string().optional(),
    email: z.string().optional(),
    password: z.string().optional(),
    phone_number: z.string().optional(),
    address: z.string().optional(),
});



