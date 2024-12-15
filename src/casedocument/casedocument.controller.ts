import { Context } from "hono";
import { 
    deleteCaseDocumentService, 
    getCaseDocumentsService, 
    getCaseDocumentByIdService, 
    insertCaseDocumentService, 
    updateCaseDocumentService 
} from "./casedocument.service";
import { convertDates } from "../date-utils"; // Import any utility functions if required
import fs from 'fs'; // File system module to handle files
import path from 'path'; // Path module for handling file paths

// Get all case documents
export const listAllCaseDocuments = async (c: Context) => {
    try {
        const documents = await getCaseDocumentsService();
        if (documents === null) {
            return c.text("📄 Oops! No case documents found. Come back soon for exciting updates! 🎉", 404);
        }
        return c.json(documents, 200);
    } catch (error: any) {
        return c.text("⚠️ Something went wrong while fetching documents. Please try again later! 🛠️", 500);
    }
};

// Get case document by ID
export const getCaseDocumentById = async (c: Context) => {
    const document_id = parseInt(c.req.param("document_id"));
    try {
        if (isNaN(document_id)) {
            return c.json({ msg: "🚫 Invalid document ID. Please provide a valid ID." }, 400);
        }
        const document = await getCaseDocumentByIdService(document_id);
        if (document === undefined) {
            return c.json({ msg: "❌ Document not found. Double-check the ID and try again!" }, 404);
        }
        return c.json(document, 200);
    } catch (error: any) {
        return c.text(`⚠️ Error: ${error?.message}. Please try again!`, 400);
    }
};

// Insert a new case document with file upload
export const insertCaseDocument = async (c: Context) => {
    try {
        const document = await c.req.formData();
        const file = document.get("file") as FormDataEntryValue;
        const case_id = document.get("case_id") as string;
        const document_name = document.get("document_name") as string;
        
        // Ensure file is present
        if (!file) {
            return c.json({ msg: "❌ No file uploaded. Please upload a valid file." }, 400);
        }

        // Convert file to binary (BYTEA)
        const fileBuffer = Buffer.from(await (file as File).arrayBuffer());

        const newDocument = {
            case_id: parseInt(case_id),
            document_name: document_name,
            document_url: `storage/path/to/${document_name}`,
            mime_type: (file as File).type,
            file_size: fileBuffer.length,
            created_at: new Date(),
            updated_at: new Date(),
            file_data: fileBuffer // Store the binary data in the database
        };

        const createdDocument = await insertCaseDocumentService(newDocument);
        if (!createdDocument) {
            return c.json({ msg: "❌ Document could not be created. Please try again later. 😒" }, 400);
        }
        return c.json(createdDocument, 201);
    } catch (error: any) {
        return c.text(`⚠️ Something went wrong while uploading the document: ${error?.message}. Try again!`, 400);
    }
};

// Update an existing case document
export const updateCaseDocument = async (c: Context) => {
    const document_id = Number(c.req.param("document_id"));
    let document = await c.req.json();
    try {
        if (isNaN(document_id)) {
            return c.json({ msg: "🚫 Invalid document ID. Please provide a valid ID." }, 400);
        }
        const existingDocument = await getCaseDocumentByIdService(document_id);
        if (existingDocument === undefined) {
            return c.json({ msg: "❌ Document not found. Double-check the ID and try again!" }, 404);
        }

        const updatedDocument = await updateCaseDocumentService(document_id, document);
        return c.json({ msg: "✅ Document updated successfully! 🎉", updatedDocument }, 200);
    } catch (error: any) {
        return c.text(`⚠️ Error while updating document: ${error?.message}`, 400);
    }
};

// Delete a case document
export const deleteCaseDocument = async (c: Context) => {
    const document_id = parseInt(c.req.param("document_id"));
    try {
        if (isNaN(document_id)) {
            return c.json({ msg: "🚫 Invalid document ID. Please provide a valid ID." }, 400);
        }
        const existingDocument = await getCaseDocumentByIdService(document_id);
        if (existingDocument === undefined) {
            return c.json({ msg: "❌ Document not found. Please check the ID!" }, 404);
        }
        await deleteCaseDocumentService(document_id);
        return c.json({ msg: "✅ Document deleted successfully! 🚀" }, 200);
    } catch (error: any) {
        return c.json({ msg: `⚠️ Error occurred while deleting document: ${error?.message}` }, 400);
    }
};
