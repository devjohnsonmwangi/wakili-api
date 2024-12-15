import { rateLimiter } from "hono-rate-limiter";

export const limiter = rateLimiter({
  windowMs: 60 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: "draft-6", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  keyGenerator: (c) => "<unique_key>", // Method to generate custom identifiers for clients.
  // store: ... , // Redis, MemoryStore, etc. See below.
});