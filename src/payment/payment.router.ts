import { Hono } from "hono";

import { 
    checkoutOrder, 
    deletePayment, 
    listAllPayments , 
  
    getPaymentById, 
   
    insertPayment, 
    
    updatePayment 
} from "./payment.controller";

export const paymentRouter = new Hono();

// Route to get all payments
paymentRouter.get('/payments', async (c) => {
    console.log("Route hit: GET /payments");
    return listAllPayments(c);
});

// Route to get a payment by its ID
paymentRouter.get('/payments/:payment_id', async (c) => {
    console.log("Route hit: GET /payments/:payment_id");
    return getPaymentById(c);
});

// Route to insert a new payment
paymentRouter.post('/payments', async (c) => {
    console.log("Route hit: POST /payments");
    return insertPayment(c);
});

// Route to update a payment by its ID
paymentRouter.put('/payments/:payment_id', async (c) => {
    console.log("Route hit: PUT /payments/:payment_id");
    return updatePayment(c);
});

// Route to delete a payment by its ID
paymentRouter.delete('/payments/:payment_id', async (c) => {
    console.log("Route hit: DELETE /payments/:payment_id");
    return deletePayment(c);
});

// // Route to get all payments made by a specific user (by user ID)
// paymentRouter.get('/payments-with-user-id/:user_id', async (c) => {
//     console.log("Route hit: GET /payments-with-user-id/:user_id");
//     return getPaymentsByUserId(c);
// });

// // Route to get a payment by its booking ID
// paymentRouter.get('/payment-by-booking-id/:booking_id', async (c) => {
//     console.log("Route hit: GET /payment-by-booking-id/:booking_id");
//     return getPaymentOrderId(c);
// });

// Route to create a Stripe checkout session for a booking
paymentRouter.post('/create-checkout-session/:booking_id', async (c) => {
    console.log("Route hit: POST /create-checkout-session/:booking_id");
    return checkoutOrder(c);
});

// // Route to fetch all payment records
// paymentRouter.get('/all-payments', async (c) => {
//     console.log("Route hit: GET /all-payments");
//     return getAllPayments(c);
// });
