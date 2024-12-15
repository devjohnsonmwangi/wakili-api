import { eq } from "drizzle-orm";
import db from "../drizzle/db";
import { feedbackTable } from "../drizzle/schema";
import { TFeedbackInsert, TFeedbackSelect } from "../drizzle/schema";

// Fetch all feedback entries
export const getFeedbackService = async (): Promise<TFeedbackSelect[] | null> => {
    return await db.query.feedbackTable.findMany();
};

// Fetch feedback by ID
export const getFeedbackByIdService = async (feedback_id: number): Promise<TFeedbackSelect | undefined> => {
    return await db.query.feedbackTable.findFirst({
        where: eq(feedbackTable.feedback_id, feedback_id)
    });
};

// Insert a new feedback entry
export const insertFeedbackService = async (feedback: TFeedbackInsert): Promise<{ feedback_id: number }[] | undefined> => {
    return await db.insert(feedbackTable).values(feedback)
        .returning({ feedback_id: feedbackTable.feedback_id })
        .execute();
};

// Update an existing feedback entry
export const updateFeedbackService = async (feedback_id: number, feedback: TFeedbackInsert) => {
    await db.update(feedbackTable).set(feedback).where(eq(feedbackTable.feedback_id, feedback_id));
    return "Feedback updated successfully 🎉";
};

// Delete a feedback entry
export const deleteFeedbackService = async (feedback_id: number) => {
    await db.delete(feedbackTable).where(eq(feedbackTable.feedback_id, feedback_id));
    return "Feedback deleted successfully 🎉";
};
