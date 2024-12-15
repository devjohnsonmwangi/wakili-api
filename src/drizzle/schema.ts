import { relations } from "drizzle-orm";
import { pgTable, pgEnum, serial, varchar, timestamp, integer, decimal, text, boolean } from "drizzle-orm/pg-core";

// Role Enum for staff roles

export const roleEnum = pgEnum("role", ['admin', 'user', 'lawyer', 'client', 'clerk', 'manager', 'support']);
// User Table (for both staff and clients)  1
export const userTable = pgTable("userTable", {
  user_id: serial("user_id").primaryKey(),
  full_name: varchar("full_name"),
  email: varchar("email").notNull().unique(),
  password: varchar("password").notNull(),
  phone_number: varchar("phone_number"),
  address: varchar("address"),
  role: roleEnum('role').default('client'),
  profile_picture: varchar("profile_picture"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Log Table (for tracking actions performed by users)  2
export const logTable = pgTable("logTable", {
  log_id: serial("log_id").primaryKey(),
  user_id: integer("user_id").notNull().references(() => userTable.user_id, { onDelete: "cascade" }),
  action: varchar("action"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Case Type Enum (for different types of legal cases)
export const caseTypeEnum = pgEnum("case_type", ['criminal', 'civil', 'family', 'corporate', 'property', 'employment', 'intellectual_property', 'immigration']);

// Case Status Enum (for tracking case progress)
export const caseStatusEnum = pgEnum("case_status", ['open', 'in_progress', 'closed', 'on_hold', 'resolved']);

// Case Table (for storing case details)  3
export const caseTable = pgTable("caseTable", {
  case_id: serial("case_id").primaryKey(),
  user_id: integer("user_id").notNull().references(() => userTable.user_id, { onDelete: "cascade" }), // Client who owns the case
  case_type: caseTypeEnum('case_type').notNull(),
  case_status: caseStatusEnum('case_status').default('open'),
  case_description: text("case_description"),
  case_number:varchar("case_number").notNull(),
  case_track_number:varchar("case_track_number").notNull(),
  fee: decimal("fee").notNull(),
  payment_status: varchar("payment_status").default("pending"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Payment Status Enum (for tracking payment status)   
export const paymentStatusEnum = pgEnum("payment_status", ['pending', 'paid', 'failed']);

// Payment Table (for tracking payments made by clients)  4
export const paymentTable = pgTable("paymentTable", {
  payment_id: serial("payment_id").primaryKey(),
  case_id: integer("case_id").notNull().references(() => caseTable.case_id, { onDelete: "cascade" }),
  user_id: integer("user_id").notNull().references(() => userTable.user_id, { onDelete: "cascade" }),
  payment_amount: decimal("payment_amount"),
  payment_status: paymentStatusEnum("payment_status").default("pending"),
  payment_mode: varchar("payment_mode"),
  session_id:varchar("session_id"),
  transaction_id: varchar("transaction_id"),
  payment_date: timestamp("payment_date").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Appointment Status Enum (for tracking appointment status)
export const appointmentStatusEnum = pgEnum("appointment_status", ['pending', 'confirmed', 'completed', 'cancelled']);

// Appointment Table (for managing client-lawyer appointments) 5
export const appointmentTable = pgTable("appointmentTable", {
  appointment_id: serial("appointment_id").primaryKey(),
  client_id: integer("client_id").notNull().references(() => userTable.user_id, { onDelete: "cascade" }),
  lawyer_id: integer("lawyer_id").notNull().references(() => userTable.user_id, { onDelete: "cascade" }), // Lawyer who is handling the appointment
  appointment_date: timestamp("appointment_date").notNull(),
  status: appointmentStatusEnum("status").default("pending"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Feedback Table (for collecting client feedback on lawyers) 6
export const feedbackTable = pgTable("feedbackTable", {
  feedback_id: serial("feedback_id").primaryKey(),
  case_id: integer("case_id").notNull().references(() => caseTable.case_id, { onDelete: "cascade" }),
  user_id: integer("user_id").notNull().references(() => userTable.user_id, { onDelete: "cascade" }),
  rating: integer("rating").notNull(), // Rating out of 5
  comments: text("comments"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Support Ticket Table (for tracking client inquiries)  7
export const ticketTable = pgTable("ticketTable", {
  ticket_id: serial("ticket_id").primaryKey(),
  user_id: integer("user_id").notNull().references(() => userTable.user_id, { onDelete: "cascade" }),
  subject: varchar("subject", { length: 255 }).notNull(),
  description: text("description").notNull(),
  status: varchar("status", { length: 255 }).default("Open").notNull(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Branch Location Table (for multiple Wakili offices/branches)  8
export const locationBranchTable = pgTable("locationBranchTable", {
  branch_id: serial("branch_id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  address: text("address").notNull(),
  contact_phone: varchar("contact_phone", { length: 255 }).notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

// Case Document Table (for storing legal documents related to cases)  9
export const caseDocumentTable = pgTable("caseDocumentTable", {
  document_id: serial("document_id").primaryKey(),
  case_id: integer("case_id").notNull().references(() => caseTable.case_id, { onDelete: "cascade" }),
  document_name: varchar("document_name").notNull(), // Name of the file
  document_url: varchar("document_url").notNull(), // URL or path to the file
  mime_type: varchar("mime_type").notNull(), // MIME type of the file (e.g., "application/pdf", "text/plain")
  file_size: integer("file_size").notNull(), // Size of the file in bytes
  created_at: timestamp("created_at").defaultNow(), // Creation timestamp
  updated_at: timestamp("updated_at").defaultNow(), // Update timestamp
});


// Event Type Enum (for different types of events)  
export const eventTypeEnum = pgEnum("event_type", ['meeting', 'hearing', 'consultation', 'reminder', 'court_date']);

// Event Table (for storing events related to cases, clients, and lawyers)  10
export const eventTable = pgTable("eventTable", {
  event_id: serial("event_id").primaryKey(),
  user_id: integer("user_id").notNull().references(() => userTable.user_id, { onDelete: "cascade" }),
  case_id: integer("case_id").notNull().references(() => caseTable.case_id, { onDelete: "cascade" }),
  event_type: eventTypeEnum("event_type").notNull(),
  event_title: varchar("event_title").notNull(),
  event_description: text("event_description"),
  start_time: varchar("start_time").notNull(),
  event_date: varchar("event_date"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Event Reminder Table (for reminders about events)  11
export const eventReminderTable = pgTable("eventReminderTable", {
  reminder_id: serial("reminder_id").primaryKey(),
  event_id: integer("event_id").notNull().references(() => eventTable.event_id, { onDelete: "cascade" }),
  reminder_time: timestamp("reminder_time").notNull(),
  reminder_message: varchar("reminder_message", { length: 255 }),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Calendar Integration Table (for syncing events with external calendars)  12
export const calendarIntegrationTable = pgTable("calendarIntegrationTable", {
  calendar_id: serial("calendar_id").primaryKey(),
  event_id: integer("event_id").notNull().references(() => eventTable.event_id, { onDelete: "cascade" }),
  calendar_type: varchar("calendar_type", { length: 50 }).notNull(), // e.g., Google, Outlook
  calendar_event_id: varchar("calendar_event_id", { length: 255 }).notNull(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});


// Relationships between Tables

// User Table Relationships
export const user_case_relation = relations(userTable, ({ many }) => ({
  cases: many(caseTable),
  payments: many(paymentTable),
  appointments: many(appointmentTable),
  feedbacks: many(feedbackTable),
  logs: many(logTable),
  tickets: many(ticketTable),
}));

export const log_user_relation = relations(logTable, ({ one }) => ({
  user: one(userTable, {
    fields: [logTable.user_id],
    references: [userTable.user_id],
  }),
}));

// Case Table Relationships
export const case_user_relation = relations(caseTable, ({ one }) => ({
  user: one(userTable, {
    fields: [caseTable.user_id],
    references: [userTable.user_id],
  }),
}));

export const case_payment_relation = relations(caseTable, ({ many }) => ({
  payments: many(paymentTable),
}));

// Payment Table Relationships
export const payment_case_relation = relations(paymentTable, ({ one }) => ({
  case: one(caseTable, {
    fields: [paymentTable.case_id],
    references: [caseTable.case_id],
  }),
  user: one(userTable, {
    fields: [paymentTable.user_id],
    references: [userTable.user_id],
  }),
}));

// Appointment Table Relationships
export const appointment_user_relation = relations(appointmentTable, ({ one }) => ({
  user: one(userTable, {
    fields: [appointmentTable.client_id],
    references: [userTable.user_id],
  }),
}));

// Feedback Table Relationships
export const feedback_user_relation = relations(feedbackTable, ({ one }) => ({
  user: one(userTable, {
    fields: [feedbackTable.user_id],
    references: [userTable.user_id],
  }),
}));

// Ticket Table Relationships
export const ticket_user_relation = relations(ticketTable, ({ one }) => ({
  user: one(userTable, {
    fields: [ticketTable.user_id],
    references: [userTable.user_id],
  }),
}));

// Event Table Relationships
export const event_case_relation = relations(eventTable, ({ one }) => ({
  case: one(caseTable, {
    fields: [eventTable.case_id],
    references: [caseTable.case_id],
  }),
}));

export const event_reminder_relation = relations(eventTable, ({ many }) => ({
  reminders: many(eventReminderTable),
}));

export const event_calendar_relation = relations(eventTable, ({ many }) => ({
  calendar_integrations: many(calendarIntegrationTable),
}));

// Event Reminder Table Relationships
export const event_reminder_event_relation = relations(eventReminderTable, ({ one }) => ({
  event: one(eventTable, {
    fields: [eventReminderTable.event_id],
    references: [eventTable.event_id],
  }),
}));

// Calendar Integration Table Relationships
export const calendar_integration_event_relation = relations(calendarIntegrationTable, ({ one }) => ({
  event: one(eventTable, {
    fields: [calendarIntegrationTable.event_id],
    references: [eventTable.event_id],
  }),
}));

// Infer Types for Insert and Select Operations
export type TUserInsert = typeof userTable.$inferInsert; //1
export type TUserSelect = typeof userTable.$inferSelect;

export type TCaseInsert = typeof caseTable.$inferInsert; //2
export type TCaseSelect = typeof caseTable.$inferSelect;

export type TPaymentInsert = typeof paymentTable.$inferInsert;  //3
export type TPaymentSelect = typeof paymentTable.$inferSelect;

export type TAppointmentInsert = typeof appointmentTable.$inferInsert; //4
export type TAppointmentSelect = typeof appointmentTable.$inferSelect;

export type TFeedbackInsert = typeof feedbackTable.$inferInsert;  //5
export type TFeedbackSelect = typeof feedbackTable.$inferSelect;

export type TTicketInsert = typeof ticketTable.$inferInsert;  //6
export type TTicketSelect = typeof ticketTable.$inferSelect;

export type TEventInsert = typeof eventTable.$inferInsert;  //7
export type TEventSelect = typeof eventTable.$inferSelect;

export type TEventReminderInsert = typeof eventReminderTable.$inferInsert;  //8
export type TEventReminderSelect = typeof eventReminderTable.$inferSelect;

export type TCalendarIntegrationInsert = typeof calendarIntegrationTable.$inferInsert;  //9
export type TCalendarIntegrationSelect = typeof calendarIntegrationTable.$inferSelect;

export type  TLogInsert= typeof  logTable.$inferInsert  //10
export type TLogSelect = typeof logTable.$inferSelect;

export type  TLocationBranchInsert= typeof locationBranchTable.$inferInsert  //11
export type TLocationBranchSelect = typeof locationBranchTable.$inferSelect;


export type  TCaseDocumentInsert= typeof caseDocumentTable.$inferInsert  //12
export type TCaseDocumentSelect = typeof caseDocumentTable.$inferSelect;
