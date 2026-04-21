import "dotenv/config";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db, schema } from "./index";

/**
 * Seed (or update) a single admin user.
 * Reads SEED_ADMIN_USERNAME and SEED_ADMIN_PASSWORD from the environment.
 * If an admin with the given username exists, its password is rehashed and
 * replaced. Otherwise, a new admin is created.
 */
async function main() {
  const username = process.env.SEED_ADMIN_USERNAME?.trim();
  const password = process.env.SEED_ADMIN_PASSWORD;

  if (!username || !password) {
    console.error("SEED_ADMIN_USERNAME and SEED_ADMIN_PASSWORD must be set in the environment.");
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const existing = await db
    .select()
    .from(schema.adminUsers)
    .where(eq(schema.adminUsers.username, username))
    .limit(1);

  if (existing.length > 0) {
    await db
      .update(schema.adminUsers)
      .set({ passwordHash })
      .where(eq(schema.adminUsers.username, username));
    console.log(`Updated password for admin "${username}"`);
  } else {
    const [created] = await db
      .insert(schema.adminUsers)
      .values({ username, passwordHash })
      .returning({ id: schema.adminUsers.id, username: schema.adminUsers.username });
    console.log(`Created admin "${created.username}" (id: ${created.id})`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
