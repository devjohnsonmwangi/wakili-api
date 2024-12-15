import db from "../drizzle/db";
import { logTable, TLogInsert, TLogSelect } from "../drizzle/schema";
import { eq } from "drizzle-orm";
//get all logs for one user
export const getAllLogsByUserIdService = async (user_id: number): Promise<TLogSelect[] | null> => {
    return await db.query.logTable.findMany({
        where: eq(logTable.user_id, user_id)
    })
}

//create a log
export const createLogService = async (log: TLogInsert) => {
    await db.insert(logTable).values(log)
    return "Log created successfully 🎉";
}

