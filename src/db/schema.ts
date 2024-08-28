import {
  pgEnum,
  pgSchema,
  pgTable,
  serial,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const taskCategoryEnum = pgEnum("task_category_enum", [
  "to-do",
  "in-progress",
  "completed",
]);
export const priorityEnum = pgEnum("priority_enum", ["low", "medium", "high"]);

const authSchema = pgSchema("auth");

export const Users = authSchema.table("users", {
  id: uuid("id").primaryKey(),
});

export const Profiles = pgTable("profiles", {
  id: uuid("id")
    .primaryKey()
    .references(() => Users.id, { onDelete: "cascade" }),
  name: text("name"),
  profilePicture: text("profile_picture"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const Tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  userId: uuid("user_id").references(() => Profiles.id, {
    onDelete: "cascade",
  }),
  description: text("description"),
  deadline: timestamp("deadline").notNull(),
  priority: priorityEnum("priority").notNull(),
  category: taskCategoryEnum("category").notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
