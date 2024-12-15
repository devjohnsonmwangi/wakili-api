import "dotenv/config";
import { Context } from "hono";
import { registerUserService, updateUserPictureService } from "./auth.service";
import bcrypt from "bcrypt";
import { sign } from "hono/jwt";
import { getUserByEmailService } from "../users/user.service";

// Utility function to validate email format
const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Register new user
export const createUser = async (c: Context) => {
    try {
        const user = await c.req.json();
        const { email, password } = user;

        // Validate email format
        if (!isValidEmail(email)) {
            return c.json({ msg: "Invalid email format. Please provide a valid email address!" }, 400);
        }

        // Check if the user already exists
        const userExists = await getUserByEmailService(email);
        if (userExists) {
            return c.json({ msg: "Email already taken. Please try a different one!" }, 409);
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(password, salt);
        user.password = hashedPass;

        // Register new user
        const newUser = await registerUserService(user);
        return c.json({ msg: "New user created successfully! Welcome aboard!", newUser }, 201);
    } catch (error: any) {
        console.error("Error during registration:", error);
        return c.json({ error: `Something went wrong: ${error?.message}` }, 500);
    }
};

// Login user
export const loginUser = async (c: Context) => {
    try {
        const { email, password } = await c.req.json();

        // Validate email format
        if (!isValidEmail(email)) {
            return c.json({ msg: "Invalid email format. Please provide a valid email address!" }, 400);
        }

        // Check if user exists
        const userExists = await getUserByEmailService(email);
        if (!userExists) {
            return c.json({ msg: "User not found. Please check your email!" }, 400);
        }

        // Validate password
        const isMatch = await bcrypt.compare(password, userExists.password as string);
        if (!isMatch) {
            return c.json({ msg: "Invalid credentials. Please check your password!" }, 400);
        }

        // Generate JWT token
        const payload = {
            id: userExists.user_id,
            full_name: userExists.full_name,
            role: userExists.role,
            exp: Math.floor(Date.now() / 1000) + Number(process.env.JWT_EXPIRATION),
        };
        const token = await sign(payload, process.env.JWT_SECRET as string);

        // Remove password field before returning user details
        const { password: _, ...userWithoutPassword } = userExists;

        return c.json({ token, user: userWithoutPassword }, 200);
    } catch (error: any) {
        console.error("Error during login:", error);
        return c.json({ error: `Something went wrong: ${error?.message}` }, 500);
    }
};

// Update user profile picture
export const updateUserPicture = async (c: Context) => {
    const user_id = Number(c.req.param("user_id"));
    try {
        const user_picture = await c.req.json();
        const updatedUser = await updateUserPictureService(user_id, user_picture);
        return c.json({ msg: "Profile picture updated successfully!", updatedUser }, 200);
    } catch (error: any) {
        console.error("Error updating profile picture:", error);
        return c.json({ error: `Something went wrong: ${error?.message}` }, 500);
    }
};
