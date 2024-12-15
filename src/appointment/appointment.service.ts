import { eq } from "drizzle-orm";
import db from "../drizzle/db";
import { appointmentTable } from "../drizzle/schema";

// Get all appointments
export const getAppointmentsService = async (): Promise<any[] | null> => {
  return await db.query.appointmentTable.findMany();
};

// Get appointment by ID
export const getAppointmentByIdService = async (appointment_id: number): Promise<any | undefined> => {
  return await db.query.appointmentTable.findFirst({
    where: eq(appointmentTable.appointment_id, appointment_id),
  });
};

// Get appointments by client ID
export const getAppointmentsByClientIdService = async (client_id: number): Promise<any[] | null> => {
  return await db.query.appointmentTable.findMany({
    where: eq(appointmentTable.client_id, client_id),
  });
};

// Get appointments by lawyer ID
export const getAppointmentsByLawyerIdService = async (lawyer_id: number): Promise<any[] | null> => {
  return await db.query.appointmentTable.findMany({
    where: eq(appointmentTable.lawyer_id, lawyer_id),
  });
};

// Create a new appointment// Create a new appointment
export const createAppointmentService = async (appointmentData: any) => {
    const createdAppointment = await db.insert(appointmentTable).values(appointmentData).returning({
      appointment_id: appointmentTable.appointment_id,
      client_id: appointmentTable.client_id,
      lawyer_id: appointmentTable.lawyer_id,
      appointment_date: appointmentTable.appointment_date,
      status: appointmentTable.status,
      created_at: appointmentTable.created_at,
      updated_at: appointmentTable.updated_at,
    });
  
    // Success message for creating an appointment
    return `🎉 Appointment successfully added for client ID: ${appointmentData.client_id} and lawyer ID: ${appointmentData.lawyer_id}. 📅 Appointment Date: ${appointmentData.appointment_date}`;
  };
  
// Update an existing appointment
export const updateAppointmentService = async (appointment_id: number, appointmentData: any) => {
  await db.update(appointmentTable).set(appointmentData).where(eq(appointmentTable.appointment_id, appointment_id));
  return "✅ Appointment updated successfully!";
};

// Cancel an appointment
export const cancelAppointmentService = async (appointment_id: number) => {
  await db.update(appointmentTable).set({ status: 'cancelled' }).where(eq(appointmentTable.appointment_id, appointment_id));
  return "⚡ Appointment cancelled successfully!";
};
