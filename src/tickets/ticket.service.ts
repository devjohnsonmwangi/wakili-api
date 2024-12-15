import { eq, and} from "drizzle-orm";
import db from "../drizzle/db";

import { TTicketInsert,TTicketSelect,ticketTable } from "../drizzle/schema";


export const getTicketsService = async (): Promise<TTicketSelect[] | null>=> {
    return await db.query.ticketTable.findMany({
        with: {
            user: {
                columns: {
                    full_name: true,
                    phone_number:true,
                    email: true,
                }
            }
        }
    })  
}

export const getTicketByUserIdService = async (ticket_id: number): Promise<TTicketSelect | undefined> => {
    return await db.query.ticketTable.findFirst({
        where: eq(ticketTable.ticket_id, ticket_id)
    })
}

export const insertTicketService = async (ticket: TTicketInsert) => {
   await db.insert(ticketTable).values(ticket)
    return "Ticket created successfully 🎉"
    
}

export const updateTicketService = async (ticket_id: number, ticket: TTicketInsert) => {
    await db.update(ticketTable).set(ticket).where(eq(ticketTable.ticket_id,ticket_id));
    return "Ticket updated successfully 🎉"
}

export const getAllTicketsByUserIdService = async (user_id: number): Promise<TTicketSelect[] | null> => {
    return await db.query.ticketTable.findMany({
        where: eq(ticketTable.user_id, user_id)
    })
}

//delete ticket
export const deleteTicketService = async (ticket_id: number) => {
    // Ensure ticket exists before deletion
    const ticket = await db.select().from(ticketTable).where(eq(ticketTable.ticket_id, ticket_id))

    if (!ticket) {
        throw new Error('Ticket not found');
    }

    // Delete the ticket by ID
    await db.delete(ticketTable).where(eq(ticketTable.ticket_id, ticket_id));

    return "Ticket deleted successfully 🎉";
};


