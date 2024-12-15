import { Hono } from "hono";
import { 
    deleteEvent, 
    getEventById, 
    insertEvent, 
    listAllEvents, 
    updateEvent 
} from "./event.controller";

export const eventRouter = new Hono();

// Get all events
eventRouter.get('/events', listAllEvents);

// Get event by ID
eventRouter.get('/events/:event_id', getEventById);

// Insert new event
eventRouter.post('/events', insertEvent);

// Update event by ID
eventRouter.put('/events/:event_id', updateEvent);

// Delete event by ID
eventRouter.delete("/events/:event_id", deleteEvent);
