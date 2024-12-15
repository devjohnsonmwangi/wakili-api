import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { updateUserValidator } from '../validators/user.validator';
import { 
    deleteUser, 
    getUserById, 
    listUsers, 
    updateUser, 
    getUsersByRole,
    // getUsersByRoleAndId 
} from './user.controller';
// import { adminRoleAuth } from '../middleWare/bearAuth';

export const userRouter = new Hono();

// Get all users      api/users
userRouter.get("/users", listUsers);

// Get users by role (excluding "client" and "user")   api/users/roles
userRouter.get("/users/roles", getUsersByRole);

// Get users by role and user_id   api/users/roles/:role/:user_id
// userRouter.get("/users/roles/:role/:user_id", getUsersByRoleAndId);

// Get a single user by ID   api/users/:user_id
userRouter.get("/users/:user_id", getUserById);

// Update a user    api/users/:user_id
userRouter.put("/users/:user_id", 
    zValidator('json', updateUserValidator, (result, c) => {    
        if (!result.success) return c.text(result.error.message + " 😒", 400);
    }), 
    updateUser
);

// Delete a user   api/users/:user_id
userRouter.delete("/users/:user_id", deleteUser);
