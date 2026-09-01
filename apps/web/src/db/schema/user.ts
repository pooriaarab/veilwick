import { createId } from "@paralleldrive/cuid2";
import type { InferSelectModel } from "drizzle-orm";
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { commonColumns } from "./common";

/**
 * Better Auth `user` model. The `name` and `emailVerified` fields are required
 * by Better Auth; the rest are app-specific. Better Auth OWNS writes to the
 * core fields; app code may add app-specific columns.
 *
 * VeilWick personalization: `userProfileJson` stores the computed affinity
 * map `{ category: score }` and onboarding picks so feed can rank without
 * re-aggregating interactions on every request.
 */
export const userTable = sqliteTable(
  "user",
  {
    ...commonColumns,
    id: text("id")
      .primaryKey()
      .$defaultFn(() => `usr_${createId()}`)
      .notNull(),
    name: text("name", { length: 255 }),
    email: text("email", { length: 255 }).unique(),
    emailVerified: integer("email_verified", { mode: "boolean" }).default(false).notNull(),
    // Better Auth compatible image field
    image: text("image", { length: 600 }),
    // Anonymous user support (Better Auth anonymous plugin)
    isAnonymous: integer("is_anonymous", { mode: "boolean" }).default(false).notNull(),
    // VeilWick: JSON blob for lightweight personalization (affinity scores + onboarding picks)
    userProfileJson: text("user_profile_json").default("{}").notNull(),
  },
  (table) => [index("user_email_idx").on(table.email)],
);

export type User = InferSelectModel<typeof userTable>;
