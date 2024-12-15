import { Hono } from 'hono';
import { sendMpesaPush } from './mpesaservice';
import { sendAirtelPush } from './airtellservice';

const payRoutes = new Hono();

payRoutes.post('/pay', async (c) => {
  const { phoneNumber, amount, provider } = await c.req.json();

  try {
    if (provider === 'mpesa') {
      const response = await sendMpesaPush(phoneNumber, amount);
      return c.json({ message: 'MPesa push sent successfully', response: response.data }, 200);
    } else if (provider === 'airtel') {
      const response = await sendAirtelPush(phoneNumber, amount);
      return c.json({ message: 'Airtel push sent successfully', response: response.data }, 200);
    } else {
      return c.json({ message: 'Invalid provider specified' }, 400);
    }
  } catch (error: any) {
    return c.json({ message: 'Error sending push notification', error: error instanceof Error ? error.message : String(error) }, 500);
  }
});

export default payRoutes;
