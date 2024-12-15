import { eq } from "drizzle-orm";
import db from "../drizzle/db";
import { caseDocumentTable } from "../drizzle/schema"; // Adjust to your file paths

export const getCaseDocumentsService = async (): Promise<any[] | null> => {
    return await db.query.caseDocumentTable.findMany();
};

export const getCaseDocumentByIdService = async (document_id: number): Promise<any | undefined> => {
    return await db.query.caseDocumentTable.findFirst({
        where: eq(caseDocumentTable.document_id, document_id)
    });
};

export const getCaseDocumentsByCaseIdService = async (case_id: number): Promise<any[] | null> => {
    return await db.query.caseDocumentTable.findMany({
        where: eq(caseDocumentTable.case_id, case_id)
    });
};

export const insertCaseDocumentService = async (document: any) => {
    // Insert the document binary data into the database
    return await db.insert(caseDocumentTable).values(document).returning({
        //document details
         document_id: caseDocumentTable.document_id,
         case_id: caseDocumentTable.case_id,
         document_name: caseDocumentTable.document_name,
            document_url: caseDocumentTable.document_url,
            mime_type: caseDocumentTable.mime_type,
            file_size: caseDocumentTable.file_size,
            created_at: caseDocumentTable.created_at,

         });
};

export const updateCaseDocumentService = async (document_id: number, document: any) => {
    await db.update(caseDocumentTable).set(document).where(eq(caseDocumentTable.document_id, document_id));
    return "✨ Case document updated successfully! 🎉";
};

export const deleteCaseDocumentService = async (document_id: number) => {
    await db.delete(caseDocumentTable).where(eq(caseDocumentTable.document_id, document_id));
    return "⚡ Case document deleted successfully! 🚀";
};
