import { Hono } from "hono";
import { 
    deleteFeedback, 
    getFeedbackById, 
    insertFeedback, 
    listAllFeedback, 
    updateFeedback 
} from "./feedback.controller";

export const feedbackRouter = new Hono();

// Get all feedback entries
feedbackRouter.get('/feedback', listAllFeedback);

// Get feedback by ID
feedbackRouter.get('/feedback/:feedback_id', getFeedbackById);

// Insert new feedback entry
feedbackRouter.post('/feedback', insertFeedback);

// Update feedback by ID
feedbackRouter.put('/feedback/:feedback_id', updateFeedback);

// Delete feedback by ID
feedbackRouter.delete("/feedback/:feedback_id", deleteFeedback);
