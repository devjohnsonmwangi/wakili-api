import { Context } from "hono";
import {
  getAppointmentsService,
  getAppointmentByIdService,
  createAppointmentService,
  updateAppointmentService,
  cancelAppointmentService,
} from "./appointment.service";

// Get all appointments
export const listAllAppointments = async (c: Context) => {
  try {
    const appointments = await getAppointmentsService();
    if (!appointments || appointments.length === 0) {
      return c.text("🔍 No appointments found. Please add one! 📝", 404);
    }
    return c.json(appointments, 200);
  } catch (error: any) {
    return c.text("⚠️ Something went wrong while fetching appointments. Please try again later! 🛠️", 500);
  }
};

// Get appointment by ID
export const getAppointmentById = async (c: Context) => {
  const appointment_id = parseInt(c.req.param("appointment_id"));
  try {
    if (isNaN(appointment_id)) {
      return c.json({ msg: "🚫 Invalid appointment ID. Please provide a valid ID." }, 400);
    }
    const appointment = await getAppointmentByIdService(appointment_id);
    if (!appointment) {
      return c.json({ msg: "❌ Appointment not found." }, 404);
    }
    return c.json(appointment, 200);
  } catch (error: any) {
    return c.text(`⚠️ Error: ${error?.message}. Please try again!`, 400);
  }
};

// Create a new appointment
// Create a new appointment
export const createAppointment = async (c: Context) => {
    try {
      const appointmentData = await c.req.json();
      const { client_id, lawyer_id, appointment_date, status } = appointmentData;
  
      if (!client_id || !lawyer_id || !appointment_date || !status) {
        return c.json({ msg: "🚫 Missing required fields. Please provide client_id, lawyer_id, appointment_date, and status." }, 400);
      }
  
      const newAppointment = {
        client_id,
        lawyer_id,
        appointment_date: new Date(appointment_date),
        status,
        created_at: new Date(),
        updated_at: new Date(),
      };
  
      // Call the service to create the appointment
      const successMessage = await createAppointmentService(newAppointment);
  
      return c.json({ msg: successMessage }, 201);
    } catch (error: any) {
      return c.text(`⚠️ Error while creating appointment: ${error?.message}. Please try again! 💡`, 400);
    }
  };
  
// Update an appointment
export const updateAppointment = async (c: Context) => {
  const appointment_id = Number(c.req.param("appointment_id"));
  const appointmentData = await c.req.json();

  try {
    if (isNaN(appointment_id)) {
      return c.json({ msg: "🚫 Invalid appointment ID. Please provide a valid ID." }, 400);
    }

    const updatedAppointment = await updateAppointmentService(appointment_id, appointmentData);
    return c.json({ msg: `✅ Appointment updated: ${updatedAppointment} 🎉` }, 200);
  } catch (error: any) {
    return c.text(`⚠️ Error while updating appointment: ${error?.message}. Please try again! 🛠️`, 400);
  }
};

// Cancel an appointment
export const cancelAppointment = async (c: Context) => {
  const appointment_id = parseInt(c.req.param("appointment_id"));
  try {
    if (isNaN(appointment_id)) {
      return c.json({ msg: "🚫 Invalid appointment ID. Please provide a valid ID." }, 400);
    }

    const cancellationMessage = await cancelAppointmentService(appointment_id);
    return c.json({ msg: `⚡ ${cancellationMessage} 🙌` }, 200);
  } catch (error: any) {
    return c.text(`⚠️ Error while cancelling appointment: ${error?.message}. Please try again! ⚠️`, 400);
  }
};
