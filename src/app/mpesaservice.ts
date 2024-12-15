import axios from 'axios'; // Axios is used to handle HTTP requests.
import * as dotenv from 'dotenv'; // dotenv is used to load environment variables.

dotenv.config(); // Load the environment variables from the `.env` file.

export const sendMpesaPush = async (phoneNumber: string, amount: number) => {
  const { MPESA_CONSUMER_KEY, MPESA_CONSUMER_SECRET, MPESA_PASSKEY, MPESA_SHORTCODE, MPESA_BASE_URL } = process.env;

  // Step 1: Generate access token
  const tokenResponse = await axios.get(`${MPESA_BASE_URL}/oauth/v1/generate?grant_type=client_credentials`, {
    auth: {
      username: MPESA_CONSUMER_KEY!, // Pass the consumer key from environment variables.
      password: MPESA_CONSUMER_SECRET!, // Pass the consumer secret from environment variables.
    },
  });
  const accessToken = tokenResponse.data.access_token; // Extract the access token from the response.

  // Step 2: Prepare the STK Push request payload
  const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14); // Generate a timestamp in the required format.
  const password = Buffer.from(`${MPESA_SHORTCODE}${MPESA_PASSKEY}${timestamp}`).toString('base64'); // Encode the password as required by the API.
  const requestBody = {
    BusinessShortCode: MPESA_SHORTCODE, // Your business shortcode (till number or paybill number).
    Password: password, // The encoded password.
    Timestamp: timestamp, // Current timestamp.
    TransactionType: 'CustomerPayBillOnline', // Type of transaction; for STK Push, this is fixed.
    Amount: amount, // Amount the user is required to authorize.
    PartyA: phoneNumber, // The phone number initiating the transaction.
    PartyB: MPESA_SHORTCODE, // The paybill or till number receiving the payment.
    PhoneNumber: phoneNumber, // The same phone number for authorization.
    CallBackURL: 'https://your-callback-url.com/mpesa', // URL to receive the payment status notification.
    AccountReference: 'AccountRef', // Reference identifier for the transaction.
    TransactionDesc: 'Authorization Notification', // Description of the transaction.
  };

  // Step 3: Send the STK Push request to MPesa API
  return axios.post(`${MPESA_BASE_URL}/mpesa/stkpush/v1/processrequest`, requestBody, {
    headers: {
      Authorization: `Bearer ${accessToken}`, // Use the generated access token for authorization.
    },
  });
};
