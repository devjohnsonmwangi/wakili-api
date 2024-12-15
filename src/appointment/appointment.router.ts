import { Hono } from "hono";
import { listAllAppointments, getAppointmentById, createAppointment, updateAppointment, cancelAppointment } from "./appointment.controller";

  export const appRouter = new Hono();

// Routes for appointments
appRouter.get("/appointments", listAllAppointments); // List all appointments
appRouter.get("/appointments/:appointment_id", getAppointmentById); // Get an appointment by ID
appRouter.post("/appointments", createAppointment); // Create a new appointment
appRouter.put("/appointments/:appointment_id", updateAppointment); // Update an appointment
appRouter.delete("/appointments/:appointment_id", cancelAppointment); // Cancel an appointment

