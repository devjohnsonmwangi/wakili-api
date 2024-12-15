import { Hono } from "hono";
import { 
    deleteCaseDocument, 
    getCaseDocumentById, 
    insertCaseDocument, 
    listAllCaseDocuments, 
    updateCaseDocument 
} from "./casedocument.controller";

export const DocumentsRouter = new Hono();

// Get all case documents
DocumentsRouter.get('/documents', listAllCaseDocuments);

// Get case document by ID
DocumentsRouter.get('/documents/:document_id', getCaseDocumentById);

// Insert new case document
DocumentsRouter.post('/documents', insertCaseDocument);

// Update case document by ID
DocumentsRouter.put('/documents/:document_id', updateCaseDocument);

// Delete case document by ID
DocumentsRouter.delete("/documents/:document_id", deleteCaseDocument);
