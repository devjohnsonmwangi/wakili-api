import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { prometheus } from '@hono/prometheus';
import { readFile } from 'fs/promises';
import dotenv from 'dotenv';
import { logger } from 'hono/logger';
import { csrf } from 'hono/csrf';
import { trimTrailingSlash } from 'hono/trailing-slash';
import { cors } from 'hono/cors';
import assert from 'assert';

dotenv.config(); // Load environment variables

// Importing all routes
import { authRouter } from './auth/auth.router';
import { userRouter } from './users/user.router';
import { branchRouter } from './location/location.router';
import { paymentRouter } from './payment/payment.router';
import { handleStripeWebhook } from './payment/payment.controller';
import { ticketRouter } from './tickets/ticket.router';
import { logRouter } from './utils/utils.router';
import { feedbackRouter } from './feedback/feedback.router';
import { eventRouter } from './event/event.router';
import { scheduleDueRemindersCron } from './eventreminder/eventreminder.controller';
import payRoutes from './app/routes';
import { casesRouter } from './case/case.router';
import { eventRemindersRouter } from './eventreminder/eventreminder.router';
import { appRouter } from './appointment/appointment.router';
import { DocumentsRouter } from './casedocument/casedocument.router';
import { aiRouter } from './aintegration/airouter';  // Adjust path if necessary




// Ensure required environment variables are loaded
assert(process.env.PORT, 'PORT is not set in the .env file');

const app = new Hono();
const { printMetrics, registerMetrics } = prometheus();

// 🕒 Schedule cron jobs
scheduleDueRemindersCron();

// 🚀 **CORS configuration**
const corsOptions = {
  origin: 'http://localhost:5173', // Allow requests from this frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], // Add OPTIONS to handle preflight
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow specific headers
  credentials: true, // Allow cookies and authorization headers
  preflightContinue: false, // Respond to OPTIONS requests properly
};

// 🛡️ Apply **CORS middleware** before everything else
app.use(cors(corsOptions));

// ✅ Handle **OPTIONS preflight requests** for all routes
app.options('*', (c) => c.text('OK'));

// 📝 **Middleware setup**
app.use(logger()); // Logs requests and responses
app.use(csrf()); // Protects against CSRF attacks
app.use(trimTrailingSlash()); // Removes trailing slashes from URLs
app.use('*', registerMetrics); // Prometheus monitoring for all requests

// 📢 **Webhook route** for Stripe webhook
app.post('/webhook', handleStripeWebhook);

// 📄 **Default route** serves an HTML file
app.get('/', async (c) => {
  try {
    const html = await readFile('./index.html', 'utf-8');
    return c.html(html);
  } catch (err: any) {
    return c.text(err.message, 500);
  }
});

// 📊 **Metrics route** for Prometheus
app.get('/metrics', printMetrics);

// 🛑 **404 Not Found handler**
app.notFound((c) => c.text('Route Not Found', 404));

// 🛣️ **Custom routes** - these routes handle the application's specific features
app.route('/ai', aiRouter);  // Prefix all AI routes with `/ai`
app.route('/', authRouter);
app.route('/', userRouter);
app.route('/', casesRouter);
app.route('/', paymentRouter);
app.route('/', appRouter);
app.route('/', feedbackRouter);
app.route('/', ticketRouter);
app.route('/', eventRemindersRouter);
app.route('/', branchRouter);
app.route('/', logRouter);
app.route('/', eventRouter);
app.route('/', DocumentsRouter);

// 🌐 **Server start-up**
console.log(`Server is running on port ${process.env.PORT} 📢 📢`);

serve({
  fetch: app.fetch,
  port: Number(process.env.PORT || 3000),
});
