import { Context } from "hono";
import { 
    deleteFeedbackService, 
    getFeedbackByIdService, 
    getFeedbackService, 
    insertFeedbackService, 
    updateFeedbackService 
} from "./feedback.service";

// Get all feedback entries
export const listAllFeedback = async (c: Context) => {
    try {
        const feedback = await getFeedbackService();
        if (feedback === null) {
            return c.text("😕 Oops! No feedback found. Come back later for insights! 💬", 404);
        }
        return c.json({ msg: "✅Thank you for your feedback ! we appreciate you", feedback:feedback}, 200);
    } catch (error: any) {
        return c.text("⚠️ Something went wrong while fetching feedback. Please try again later! 🛠️", 500);
    }
};

// Get feedback by ID
export const getFeedbackById = async (c: Context) => {
    const feedback_id = parseInt(c.req.param("feedback_id"));
    try {
        if (isNaN(feedback_id)) {
            return c.json({ msg: "🚫 Invalid ID. Please provide a valid feedback ID." }, 400);
        }
        const feedback = await getFeedbackByIdService(feedback_id);
        if (feedback === undefined) {
            return c.json({ msg: "❌ Feedback not found. Check the ID and try again!" }, 404);
        }
        return c.json(feedback, 200);
    } catch (error: any) {
        return c.text(`⚠️ Error: ${error?.message}. Please try again!`, 400);
    }
};

// Insert a new feedback entry
export const insertFeedback = async (c: Context) => {
    try {
        const feedback = await c.req.json();
        const createdFeedback = await insertFeedbackService(feedback);
        if (createdFeedback === undefined) {
            return c.json({ msg: "❌ Feedback could not be created. Please try again later. 😒" }, 400);
        }
        return c.json({ msg: "✅Thank you for your feedback ! we appreciate you", feedback:createdFeedback}, 201);
    } catch (error: any) {
        return c.text(`⚠️ Something went wrong: ${error?.message}. Try again!`, 400);
    }
};

// Update an existing feedback entry
export const updateFeedback = async (c: Context) => {
    const feedback_id = Number(c.req.param("feedback_id"));
    const feedback = await c.req.json();
    try {
        if (isNaN(feedback_id)) {
            return c.json({ msg: "🚫 Invalid ID. Please provide a valid feedback ID." }, 400);
        }
        const existingFeedback = await getFeedbackByIdService(feedback_id);
        if (existingFeedback === undefined) {
            return c.json({ msg: "❌ Feedback not found. Double-check the ID and try again!" }, 404);
        }
        const updatedFeedback = await updateFeedbackService(feedback_id, feedback);
        return c.json({ msg: "✅ Feedback updated successfully! 🎉", updatedFeedback }, 200);
    } catch (error: any) {
        return c.text(`⚠️ Error while updating feedback: ${error?.message}`, 400);
    }
};

// Delete a feedback entry
export const deleteFeedback = async (c: Context) => {
    const feedback_id = parseInt(c.req.param("feedback_id"));
    try {
        if (isNaN(feedback_id)) {
            return c.json({ msg: "🚫 Invalid ID. Please provide a valid feedback ID." }, 400);
        }
        const existingFeedback = await getFeedbackByIdService(feedback_id);
        if (existingFeedback === undefined) {
            return c.json({ msg: "❌ Feedback not found. Please check the ID!" }, 404);
        }
        const deletedFeedback = await deleteFeedbackService(feedback_id);
        return c.json({ msg: "✅ Feedback deleted successfully! 🚀", deletedFeedback }, 200);
    } catch (error: any) {
        return c.json({ msg: `⚠️ Error occurred while deleting feedback: ${error?.message}` }, 400);
    }
};
