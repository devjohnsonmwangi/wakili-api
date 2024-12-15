import axios from 'axios'; // Import Axios to handle HTTP requests.
import * as dotenv from 'dotenv'; // Import dotenv to load environment variables.

dotenv.config(); // Load the environment variables from the `.env` file.

export const sendAirtelPush = async (phoneNumber: string, amount: number) => {
  const { AIRTEL_API_KEY, AIRTEL_SECRET_KEY, AIRTEL_BASE_URL } = process.env;

  // Step 1: Generate access token for Airtel API
  const tokenResponse = await axios.post(
    `${AIRTEL_BASE_URL}/auth/oauth2/token`, // Airtel token generation endpoint.
    {
      client_id: AIRTEL_API_KEY, // Airtel API Key from environment variables.
      client_secret: AIRTEL_SECRET_KEY, // Airtel Secret Key from environment variables.
      grant_type: 'client_credentials', // OAuth2 grant type used for API access.
    },
    { headers: { 'Content-Type': 'application/json' } } // Specify JSON content type.
  );
  const accessToken = tokenResponse.data.access_token; // Extract the access token from the response.

  // Step 2: Prepare the payment request payload
  const requestBody = {
    reference: 'TransactionRef', // Unique reference for the transaction.
    subscriber: {
      country: 'KE', // Country code for the subscriber (e.g., Kenya).
      currency: 'KES', // Currency code (e.g., Kenyan Shillings).
      msisdn: phoneNumber, // Subscriber's phone number.
    },
    transaction: {
      amount, // Amount to be authorized.
      id: 'TransactionID', // Unique transaction ID.
    },
  };

  // Step 3: Send the payment request to Airtel API
  return axios.post(`${AIRTEL_BASE_URL}/standard/v1/payments/`, requestBody, {
    headers: {
      Authorization: `Bearer ${accessToken}`, // Use the generated access token for authorization.
      'Content-Type': 'application/json', // Specify JSON content type.
    },
  });
};
