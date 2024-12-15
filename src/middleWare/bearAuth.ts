import "dotenv/config";
import { verify } from "hono/jwt";
import { Context, Next } from "hono";
import { JwtPayload } from "jsonwebtoken";

interface HonoRequest<T, U> {
    user?: T;
}

// AUTHENTICATION MIDDLEWARE
export const verifyToken = async (token: string, secret: string) => {
    try {
        const decoded = await verify(token as string, secret);
        return decoded;
    } catch (error: any) {
        return null;
    }
};

// AUTHORIZATION MIDDLEWARE WITH ROLE SUPPORT
export const authMiddleware = async (
    c: Context & { req: HonoRequest<any, unknown> },
    next: Next,
    requiredRoles: string[] // Accepts an array of roles
) => {
    const token = c.req.header("Authorization");

    if (!token) return c.json({ error: "Token is required" }, 401);

    const decoded = await verifyToken(token as string, process.env.JWT_SECRET as string);

    if (!decoded) return c.json({ error: "Invalid token" }, 401);

    // Check if the decoded role is one of the required roles
    if (requiredRoles.includes((decoded as JwtPayload & { role: string }).role)) {
        c.req.user = decoded;
        return next();
    }

    return c.json({ error: "Unauthorized" }, 401);
};

// Role-specific authorization middleware functions
export const adminRoleAuth = async (c: Context, next: Next) =>
    await authMiddleware(c, next, ["admin"]);

export const clerkrRoleAuth = async (c: Context, next: Next) =>
    await authMiddleware(c, next, ["clerk"]);

export const lawyerRoleAuth = async (c: Context, next: Next) =>
    await authMiddleware(c, next, ["lawyer"]);

export const managerRoleAuth = async (c: Context, next: Next) =>
    await authMiddleware(c, next, ["manager"]);

export const clientRoleAuth = async (c: Context, next: Next) =>
    await authMiddleware(c, next, ["client"]);

export const receptionistRoleAuth = async (c: Context, next: Next) =>
    await authMiddleware(c, next, ["clerk"]);

// Both roles example, allowing both admin and manager
export const supportAuth = async (c: Context, next: Next) =>
    await authMiddleware(c, next, ["admin", "manager"]);


