// Intentionally empty by default.
// Add Drizzle tables here when the site actually needs a database.
// See examples/d1/db/schema.ts for an opt-in example.
export {};
import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';
export const inquiries = sqliteTable('inquiries', {
  id: text('id').primaryKey(), createdAt: integer('created_at').notNull(), name: text('name').notNull(),
  email: text('email').notNull(), phone: text('phone'), cemetery: text('cemetery'), town: text('town'),
  memorialName: text('memorial_name'), service: text('service').notNull(), style: text('style').notNull(),
  notes: text('notes'), language: text('language').notNull().default('en'),
  clientHash: text('client_hash').notNull(), status: text('status').notNull().default('new'),
}, table => [index('inquiries_rate_limit').on(table.clientHash, table.createdAt)]);
export const inquiryPhotos = sqliteTable('inquiry_photos', {
  id: text('id').primaryKey(), inquiryId: text('inquiry_id').notNull().references(() => inquiries.id),
  objectKey: text('object_key').notNull(), filename: text('filename').notNull(), mime: text('mime').notNull(), bytes: integer('bytes').notNull(),
});
