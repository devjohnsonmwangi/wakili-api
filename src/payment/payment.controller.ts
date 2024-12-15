import { Context } from "hono"; // Import the Hono framework for handling HTTP requests and responses
import dotenv from "dotenv"; // Load environment variables from a .env file
import Stripe from "stripe"; // Import the Stripe SDK for payment handling

// Import payment-related service functions for handling database operations
import { 
    deletePaymentService, 
    getPaymentByOrderIdService, 
    getPaymentByIdService, 
    getPaymentsByUserIdService, 
    getPaymentService, 
    insertPaymentService, 
    listAllPaymentsService, 
    printAllPaymentsService, 
    updatePaymentBySessionIdService, 
    updatePaymentService 
} from "./payment.service";

import { FRONTEND_URL } from "../proxxy/proxxy"; // Import the frontend URL for success/cancel redirects

dotenv.config(); // Initialize dotenv to use environment variables

// Initialize Stripe using the secret key from environment variables
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, { apiVersion: "2024-06-20" });

/**
 * List all payments
 * Fetches and returns a list of all payments from the database
 */
export const listAllPayments = async (c: Context) => {
    console.log("Fetching all payments...");
    try {
        const payments = await listAllPaymentsService(); // Fetch all payments
        console.log("Payments fetched:", payments);
        if (!payments.length) 
            return c.text("🚫 No payments found. Please check again! 🙇‍♂️", 404); // No payments found
        return c.json(payments, 200); // Return payments in JSON format
    } catch (error: any) {
        console.error("Error fetching payments:", error.message);
        return c.text(`❌ Error fetching payments: ${error.message}`, 500); // Handle server errors
    }
};

/**
 * Get payment by ID
 * Fetches a specific payment by its ID
 */
export const getPaymentById = async (c: Context) => {
    const payment_id = parseInt(c.req.param("payment_id")); // Parse payment ID from request parameters
    console.log("Fetching payment by ID:", payment_id);
    if (isNaN(payment_id)) 
        return c.text("⚠️ Invalid payment ID. Please check your input! 🔍", 400); // Handle invalid IDs

    try {
        const payment = await getPaymentByIdService(payment_id); // Fetch payment details
        console.log("Payment fetched:", payment);
        if (!payment) 
            return c.text("😞 Payment not found. Double-check your ID! 🔍", 404); // Payment not found
        return c.json(payment, 200); // Return payment details in JSON
    } catch (error: any) {
        console.error("Error fetching payment by ID:", error.message);
        return c.text(`❌ Error: ${error.message}. Please try again! 🔁`, 500); // Handle server errors
    }
};

/**
 * Insert payment
 * Inserts a new payment into the database
 */
export const insertPayment = async (c: Context) => {
    console.log("Inserting new payment...");
    try {
        const paymentDetails = await c.req.json(); // Parse payment details from request body
        console.log("Payment details:", paymentDetails);
        const createdPayment = await insertPaymentService(paymentDetails); // Insert payment into the database
        console.log("Payment created:", createdPayment);
        if (!createdPayment) 
            return c.text("😒 Payment not created. Something went wrong! 🤔", 400); // Handle failure
        return c.json(createdPayment, 201); // Return the created payment details
    } catch (error: any) {
        console.error("Error inserting payment:", error.message);
        return c.text(`❌ ${error.message}. Try again later! 🕔`, 500); // Handle server errors
    }
};

/**
 * Update payment
 * Updates an existing payment record in the database
 */
export const updatePayment = async (c: Context) => {
    const payment_id = Number(c.req.param("payment_id")); // Parse payment ID from request parameters
    console.log("Updating payment with ID:", payment_id);
    if (isNaN(payment_id)) 
        return c.text("⚠️ Invalid payment ID. Please check again! 🔎", 400); // Handle invalid IDs

    try {
        const paymentDetails = await c.req.json(); // Parse updated payment details from request body
        console.log("Update details:", paymentDetails);
        const existingPayment = await getPaymentByIdService(payment_id); // Check if payment exists
        console.log("Existing payment:", existingPayment);
        if (!existingPayment) 
            return c.text("😔 Payment not found. Verify the ID! 🔍", 404); // Payment not found

        const updatedPayment = await updatePaymentService(payment_id, paymentDetails); // Update payment in database
        console.log("Payment updated:", updatedPayment);
        return c.json({ msg: "✅ Payment successfully updated! 🎉", updatedPayment }, 200); // Return success response
    } catch (error: any) {
        console.error("Error updating payment:", error.message);
        return c.text(`❌ ${error.message}. Something went wrong! 😞`, 500); // Handle server errors
    }
};

/**
 * Delete payment
 * Deletes a payment record from the database
 */
export const deletePayment = async (c: Context) => {
    const payment_id = parseInt(c.req.param("payment_id")); // Parse payment ID from request parameters
    console.log("Deleting payment with ID:", payment_id);
    if (isNaN(payment_id)) 
        return c.text("⚠️ Invalid payment ID. Check and try again! 🔄", 400); // Handle invalid IDs

    try {
        const existingPayment = await getPaymentByIdService(payment_id); // Check if payment exists
        console.log("Payment to delete:", existingPayment);
        if (!existingPayment) 
            return c.text("🚫 Payment not found. Check the ID! 🔎", 404); // Payment not found

        await deletePaymentService(payment_id); // Delete payment from database
        console.log("Payment deleted successfully.");
        return c.text("🗑️ Payment successfully deleted! 🎉", 200); // Return success response
    } catch (error: any) {
        console.error("Error deleting payment:", error.message);
        return c.text(`❌ ${error.message}. Try again later! ⏳`, 500); // Handle server errors
    }
};

/**
 * Checkout Order with Stripe
 * Creates a Stripe Checkout session and processes an order
 */
export const checkoutOrder = async (c: Context) => {
    console.log("Creating Stripe Checkout session...");
    try {
        const order = await c.req.json(); // Parse order details from request body
        console.log("Order details:", order);

        if (!order.order_id || !order.total_amount) {
            console.error("Missing order ID or total amount.");
            return c.text("⚠️ Missing order ID or total amount. Fill both details! 📄", 400); // Handle missing details
        }

        const conversionRate = 0.007; // Conversion rate (KES to USD)
        const totalAmountInUsd = Math.round(order.total_amount * conversionRate * 100); // Convert to cents
        console.log("Total amount in USD (cents):", totalAmountInUsd);

        const sessionParams: Stripe.Checkout.SessionCreateParams = {
            payment_method_types: ["card"], // Accept card payments
            line_items: [{
                price_data: {
                    currency: "usd", // Currency set to USD
                    product_data: { name: `Order ID: ${order.order_id}` }, // Display order ID
                    unit_amount: totalAmountInUsd, // Total amount in cents
                },
                quantity: 1, // Quantity set to 1
            }],
            mode: "payment", // Payment mode
            success_url: `${FRONTEND_URL}/success`, // Redirect on success
            cancel_url: `${FRONTEND_URL}/failed`, // Redirect on failure
        };

        const session = await stripe.checkout.sessions.create(sessionParams); // Create a Stripe Checkout session
        console.log("Stripe Checkout session created:", session);

        const paymentDetails = {
            order_id: order.order_id,
            user_id: order.user_id,
            payment_amount: order.total_amount,
            payment_mode: "card",
            session_id: session.id,
        };

        const createPayment = await insertPaymentService(paymentDetails); // Save payment details in database
        console.log("Payment saved in database:", createPayment);
        return c.json({ sessionId: session.id, payment: createPayment }, 200); // Return session and payment details
    } catch (error: any) {
        console.error("Error during checkout:", error.message);
        return c.text(`❌ ${error.message}. Checkout failed! 😞`, 500); // Handle server errors
    }
};

/**
 * Handle Stripe Webhook
 * Processes Stripe events for payment updates
 */
export const handleStripeWebhook = async (c: Context) => {
    const sig = c.req.header("stripe-signature"); // Retrieve Stripe signature from headers
    console.log("Handling Stripe webhook...");
    const rawBody = await c.req.text(); // Get raw request body

    if (!sig) {
        console.error("Missing Stripe signature header.");
        return c.text("🚨 Webhook Error: Missing Stripe signature header! ❌", 400); // Handle missing signature
    }

    try {
        const event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET as string); // Verify and construct event
        console.log("Stripe event verified:", event);

        switch (event.type) {
            case "checkout.session.completed":
                console.log("Checkout session completed.");
                const session = event.data.object as Stripe.Checkout.Session;
                const paymentIntent = session.payment_intent as string;
                console.log("Payment intent:", paymentIntent);

                const paymentStatus = await updatePaymentBySessionIdService(session.id); // Update payment status
                console.log("Payment status updated:", paymentStatus);
                break;

            default:
                console.warn(`Unhandled Stripe event type: ${event.type}`);
        }

        return c.text("👍 Webhook received and processed successfully! ✅", 200); // Return success response
    } catch (error: any) {
        console.error("Error handling webhook:", error.message);
        return c.text(`❌ Webhook Error: ${error.message}. Please try again! 🔁`, 500); // Handle errors
    }
};
