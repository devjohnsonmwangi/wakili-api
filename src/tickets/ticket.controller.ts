import { Context } from "hono";
import { deleteTicketService, getAllTicketsByUserIdService, getTicketByUserIdService, getTicketsService, insertTicketService, updateTicketService } from "./ticket.service";

// List all tickets
export const listAllTickets = async (c: Context) => {
    try {
        const tickets = await getTicketsService();
        if (tickets === null) return c.text("No tickets found 😕. Please check back later!");
        return c.json(tickets, 200);
    } catch (error: any) {
        return c.text("❌ Error while fetching tickets. Please try again later! ⏳");
    }
}

// Get ticket by ticket ID
export const getTicketByUserId = async (c: Context) => {
    const ticket_id = parseInt(c.req.param("ticket_id"));
    try {
        if (isNaN(ticket_id)) return c.json({ msg: "❌ Invalid ID. Please provide a valid ticket ID!" }, 400);

        // Search for ticket
        const ticket = await getTicketByUserIdService(ticket_id);   
        if (ticket === undefined) return c.json({ msg: "🎫 Ticket not found. Double-check the ID!" }, 404);

        return c.json(ticket, 200);
    } catch (error: any) {
        return c.text(`❌ Error: ${error?.message}. Please try again later! ⏳`, 400);
    }
}

// Insert a new ticket
export const insertTicket = async (c: Context) => {
    try {
        const ticket = await c.req.json();
        const createdTicket = await insertTicketService(ticket);
        if (createdTicket === undefined) return c.json({ msg: "Ooops, ticket not created 😒. Please try again!" }, 400);
        return c.json(createdTicket, 201);        
    } catch (error: any) {
        return c.text(`❌ Error: ${error?.message}. Something went wrong, please try again! 🔄`, 400);
    }
}

// Update ticket
export const updateTicket = async (c: Context) => {
    const ticket_id = Number(c.req.param("ticket_id"));
    const ticket = await c.req.json();
    try {
        if (isNaN(ticket_id)) return c.json({ msg: "❌ Invalid ID. Please provide a valid ticket ID!" }, 400);

        // Search for ticket
        const existingTicket = await getTicketByUserIdService(ticket_id);
        if (existingTicket === undefined) return c.json({ msg: "Ooops, ticket not found 😒. Try a valid ID!" }, 404);

        // Update ticket
        const updatedTicket = await updateTicketService(ticket_id, ticket);
        return c.json({ msg: "✅ Ticket updated successfully!", updatedTicket }, 200);
    } catch (error: any) {
        return c.text(`❌ Error: ${error?.message}. Please try again later! ⏳`, 400);
    }
}

// Get tickets by user ID
export const getTicketsByUserId = async (c: Context) => {
    const user_id = parseInt(c.req.param("user_id"));
    try {
        if (isNaN(user_id)) return c.json({ msg: "❌ Invalid ID. Please provide a valid user ID!" }, 400);

        // Search for tickets
        const tickets = await getAllTicketsByUserIdService(user_id);
        if (tickets === undefined) return c.json({ msg: "🎫 No tickets found for this user!" }, 404);

        return c.json(tickets, 200);
    } catch (error: any) {
        return c.json({ msg: `❌ Error: ${error?.message}. Please try again later! ⏳` }, 400);
    }
}

// Delete ticket

export const deleteTicket = async (c: Context) => {
    const ticket_id = parseInt(c.req.param("ticket_id"));

    if (isNaN(ticket_id)) {
        return c.json({ error: "❌ Invalid ticket ID. Please provide a valid ID!" }, 400);
    }

    try {
        const result = await deleteTicketService(ticket_id);
        return c.json({ msg: result }, 200);
    } catch (error) {
        return c.json({ msg: "❌ Failed to delete ticket. Please try again later!" }, 500);
    }
};
