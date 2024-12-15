import {Hono} from "hono"
import { deleteTicket, getTicketByUserId, getTicketsByUserId, insertTicket, listAllTickets, updateTicket } from "./ticket.controller";

export const ticketRouter = new Hono();

//get all states
ticketRouter.get('/ticket', listAllTickets)

//get state by id
ticketRouter.get('/ticket/:ticket_id', getTicketByUserId)

//insert state
ticketRouter.post('/ticket', insertTicket)

//update state
ticketRouter.put('/ticket/:ticket_id', updateTicket)

//get all ticket for one user
ticketRouter.get('/ticket/user/:user_id', getTicketsByUserId)


//delete state
ticketRouter.delete('/ticket/:ticket_id', deleteTicket);

