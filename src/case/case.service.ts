import { eq } from "drizzle-orm";
import db from "../drizzle/db";
import { TCaseInsert, TCaseSelect, caseTable } from "../drizzle/schema";

// Get all cases
export const getCasesService = async (): Promise<TCaseSelect[] | null> => {     
    return await db.query.caseTable.findMany({
        with: {
            user: {
                columns: {
                    full_name: true,
                    phone_number:true,
                    email: true,
                }
            }
        }
    });
}

// Get case by ID
export const getCaseByIdService = async (case_id: number): Promise<TCaseSelect | undefined> => {
    return await db.query.caseTable.findFirst({
        where: eq(caseTable.case_id, case_id)
    })
}

// Get cases by user ID (client who owns the case)
export const getCasesByUserIdService = async (user_id: number): Promise<TCaseSelect[] | null> => {
    return await db.query.caseTable.findMany({
        where: eq(caseTable.user_id, user_id)
    });
}

// Create a new case
export const createCaseService = async (caseData: TCaseInsert): Promise<string> => {
    await db.insert(caseTable).values(caseData);
    return "Case created successfully 🎉";
}

// Update case details
export const updateCaseService = async (case_id: number, caseData: TCaseInsert): Promise<string> => {
    await db.update(caseTable).set(caseData).where(eq(caseTable.case_id, case_id));
    return "Case updated successfully 🎉";
}

// Delete case by ID
export const deleteCaseService = async (case_id: number): Promise<string> => {
    await db.delete(caseTable).where(eq(caseTable.case_id, case_id));
    return "Case deleted successfully 🎉";
}
