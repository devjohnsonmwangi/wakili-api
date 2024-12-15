import nodemailer from 'nodemailer';
import { getEventReminderByIdService } from '../eventreminder/eventreminder.service'; // Import the service
import { getEventByIdService } from '../event/event.service'; // Event Service
import { getUserByIdService } from '../users/user.service'; // User Service

// Create a reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Function to send emails
const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    await transporter.sendMail({
      from: `"The Reminder Team" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log('✅ Reminder email sent successfully!');
  } catch (error) {
    console.error('⚠️ Error sending email:', error);
  }
};

// Function to send event reminder email
export const sendEventReminderEmail = async (reminder_id: number) => {
  try {
    // Fetch reminder details using the service
    const reminder = await getEventReminderByIdService(reminder_id);

    if (!reminder) {
      console.error("⚠️ Reminder not found for ID:", reminder_id);
      return;
    }

    // Fetch associated event details
    const event = await getEventByIdService(reminder.event_id);

    if (!event) {
      console.error("⚠️ Event not found for ID:", reminder.event_id);
      return;
    }

    // Fetch user details
    const user = await getUserByIdService(event.user_id);

    if (!user) {
      console.error("⚠️ User not found for event:", event.event_title);
      return;
    }

    // Prepare email subject and styled HTML body
    const emailSubject = `✨ Reminder: ${event.event_title} is coming up!`;
    const emailBody = `
      <div style="font-family: Arial, sans-serif; background-color: #f7f9fc; padding: 20px; border-radius: 10px; border: 1px solid #e3e6f0; max-width: 600px; margin: 0 auto; color: #2d3748;">
        <header style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #2b6cb0; font-size: 24px; margin: 0;">📅 Event Reminder</h1>
          <p style="color: #718096; font-size: 16px;">Don't miss out on your upcoming event!</p>
        </header>
        
        <div style="background-color: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.1);">
          <h2 style="color: #2c5282; font-size: 20px; margin-bottom: 10px;">Hello, ${user.full_name}!</h2>
          <p style="color: #4a5568; font-size: 16px; line-height: 1.5;">
            🌟 We’re reminding you about your upcoming event: <strong style="color: #2c5282;">${event.event_title}</strong>. Here are the details:
          </p>

          <table style="width: 100%; margin-top: 15px; border-collapse: collapse;">
            <tr>
              <td style="font-weight: bold; color: #4a5568; padding: 8px 10px; border-bottom: 1px solid #e2e8f0;">📌 Description:</td>
              <td style="color: #4a5568; padding: 8px 10px; border-bottom: 1px solid #e2e8f0;">${event.event_description || 'No description provided.'}</td>
            </tr>
            <tr>
              <td style="font-weight: bold; color: #4a5568; padding: 8px 10px; border-bottom: 1px solid #e2e8f0;">🗓 Date:</td>
              <td style="color: #4a5568; padding: 8px 10px; border-bottom: 1px solid #e2e8f0;">${event.event_date}</td>
            </tr>
            <tr>
              <td style="font-weight: bold; color: #4a5568; padding: 8px 10px; border-bottom: 1px solid #e2e8f0;">⏰ Time:</td>
              <td style="color: #4a5568; padding: 8px 10px; border-bottom: 1px solid #e2e8f0;">${event.start_time}</td>
            </tr>
          </table>
        </div>

        <div style="background-color: #ebf8ff; padding: 15px; margin-top: 20px; border-radius: 8px; color: #2c5282;">
          <h3 style="margin-top: 0; color: #2b6cb0;">🔔 Reminder Details</h3>
          <p style="margin: 5px 0;"><strong>🕰 Reminder Time:</strong> ${reminder.reminder_time}</p>
          <p style="margin: 5px 0;"><strong>📜 Message:</strong> ${reminder.reminder_message}</p>
        </div>

        <footer style="text-align: center; margin-top: 20px; padding-top: 15px; border-top: 1px solid #e2e8f0;">
          <p style="color: #718096; font-size: 14px;">Thank you for using our service! 💌</p>
        </footer>
      </div>
    `;

    // Send email
    await sendEmail(user.email, emailSubject, emailBody);
    console.log(`🔔 Reminder email sent for event: ${event.event_title} to ${user.email}`);
  } catch (error: any) {
    console.error("⚠️ Error sending event reminder:", error?.message);
  }
};
