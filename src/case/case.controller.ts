import { Context } from "hono";
import { 
    deleteCaseService, 
    getCaseByIdService, 
    getCasesService, 
    createCaseService, 
    updateCaseService, 
    getCasesByUserIdService,
} from "./case.service";
import { convertDates } from "../date-utils"; // Import the convertDates utility

// Get all cases
export const listAllCases = async (c: Context) => {
    try {
        const cases = await getCasesService();
        if (cases === null) {
            return c.text("😕 Oops! No cases found. Come back soon for exciting updates! 🎉", 404);
        }

        // Convert date fields in all cases
        const convertedCases = cases.map(caseItem => 
            convertDates(caseItem, ["created_at", "updated_at"]) // Specify the date fields
        );

        return c.json(convertedCases, 200);
    } catch (error: any) {
        return c.text("⚠️ Something went wrong while fetching cases. Please try again later! 🛠️", 500);
    }
};

// Get case by ID
export const getCaseById = async (c: Context) => {
    const case_id = parseInt(c.req.param("case_id"));
    try {
        if (isNaN(case_id)) {
            return c.json({ msg: "🚫 Invalid ID. Please provide a valid case ID." }, 400);
        }
        const caseItem = await getCaseByIdService(case_id);
        if (caseItem === undefined) {
            return c.json({ msg: "❌ Case not found. Double-check the ID and try again!" }, 404);
        }

        // Convert date fields in the case
        const convertedCase = convertDates(caseItem, ["created_at", "updated_at"]); // Specify the date fields

        return c.json(convertedCase, 200);
    } catch (error: any) {
        return c.text(`⚠️ Error: ${error?.message}. Please try again!`, 400);
    }
};

// Insert a new case
export const createCase = async (c: Context) => {
    try {
        const caseData = await c.req.json();
        
        // Convert date fields before inserting
        const convertedCaseData = convertDates(caseData, ["created_at", "updated_at"]); // Specify the date fields

        const createdCase = await createCaseService(convertedCaseData);
        if (createdCase === undefined) {
            return c.json({ msg: "❌ Case could not be created. Please try again later. 😒" }, 400);
        }
        return c.json(createdCase, 201);
    } catch (error: any) {
        return c.text(`⚠️ Something went wrong: ${error?.message}. Try again!`, 400);
    }
};

// Get tickets by user ID
export const getCasesByUserId= async (c: Context) => {
    const user_id = parseInt(c.req.param("user_id"));
    try {
        if (isNaN(user_id)) return c.json({ msg: "❌ Invalid ID. Please provide a valid user ID!" }, 400);

        // Search for tickets
        const cases = await getCasesByUserIdService(user_id);
        if (cases === undefined) return c.json({ msg: "🎫 No tickets found for this user!" }, 404);

        return c.json(cases, 200);
    } catch (error: any) {
        return c.json({ msg: `❌ Error: ${error?.message}. Please try again later! ⏳` }, 400);
    }
}


// Update an existing case
export const updateCase = async (c: Context) => {
    const case_id = Number(c.req.param("case_id"));
    let caseData = await c.req.json();
    try {
        if (isNaN(case_id)) {
            return c.json({ msg: "🚫 Invalid ID. Please provide a valid case ID." }, 400);
        }
        const existingCase = await getCaseByIdService(case_id);
        if (existingCase === undefined) {
            return c.json({ msg: "❌ Case not found. Double-check the ID and try again!" }, 404);
        }

        // Convert date fields before updating
        caseData = convertDates(caseData, ["created_at", "updated_at"]); // Specify the date fields

        const updatedCase = await updateCaseService(case_id, caseData);
        return c.json({ msg: "✅ Case updated successfully! 🎉", updatedCase }, 200);
    } catch (error: any) {
        return c.text(`⚠️ Error while updating case: ${error?.message}`, 400);
    }
};

// Delete a case
export const deleteCase = async (c: Context) => {
    const case_id = parseInt(c.req.param("case_id"));
    try {
        if (isNaN(case_id)) {
            return c.json({ msg: "🚫 Invalid ID. Please provide a valid case ID." }, 400);
        }
        const existingCase = await getCaseByIdService(case_id);
        if (existingCase === undefined) {
            return c.json({ msg: "❌ Case not found. Please check the ID!" }, 404);
        }
        const deletedCase = await deleteCaseService(case_id);
        return c.json({ msg: "✅ Case deleted successfully! 🚀", deletedCase }, 200);
    } catch (error: any) {
        return c.json({ msg: `⚠️ Error occurred while deleting case: ${error?.message}` }, 400);
    }
};



