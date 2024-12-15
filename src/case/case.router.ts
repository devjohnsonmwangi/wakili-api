import { Hono } from "hono";
import { 
    deleteCase, 
    getCaseById, 
    createCase, 
    listAllCases, 
    updateCase ,
    getCasesByUserId
} from "./case.controller";

export const casesRouter = new Hono();

// Get all cases
casesRouter.get('/cases', listAllCases);

// Get case by ID
casesRouter.get('/cases/:case_id', getCaseById);

//Get cases by user id
casesRouter.get('/cases/user/:user_id',   getCasesByUserId)

// Insert new case
casesRouter.post('/cases', createCase);

// Update case by ID
casesRouter.put('/cases/:case_id', updateCase);

// Delete case by ID
casesRouter.delete("/cases/:case_id", deleteCase);
