import { Hono } from "hono"
import { addLog, getAllLogsByUserId } from "./utils.controller";

export const logRouter = new Hono();

//add a new log
logRouter.post('/log', addLog)

//getAllLogsByUserId
logRouter.get('/log/user/:user_id', getAllLogsByUserId)