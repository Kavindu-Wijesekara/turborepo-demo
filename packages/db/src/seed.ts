import * as dotenv from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { services } from "./schema";

dotenv.config({ path: "../../.env.local" });
dotenv.config({ path: "../../.env" });

const connectionString = process.env.DATABASE_URL!;

async function seed() {
  const client = postgres(connectionString, { prepare: false });
  const db = drizzle(client);

  console.log("Seeding services...");

  await db
    .insert(services)
    .values([
      {
        name: "Basic Plan",
        description: "Essential features for small teams",
        price: 999,
        category: "subscription",
        isActive: true,
      },
      {
        name: "Pro Plan",
        description: "Advanced features for growing businesses",
        price: 2999,
        category: "subscription",
        isActive: true,
      },
      {
        name: "Enterprise Plan",
        description: "Full suite with premium support",
        price: 9999,
        category: "subscription",
        isActive: true,
      },
      {
        name: "API Access",
        description: "RESTful API integration",
        price: 1999,
        category: "addon",
        isActive: true,
      },
      {
        name: "Priority Support",
        description: "24/7 dedicated support",
        price: 499,
        category: "addon",
        isActive: true,
      },
      {
        name: "Analytics Dashboard",
        description: "Advanced analytics and reporting",
        price: 799,
        category: "addon",
        isActive: true,
      },
    ])
    .onConflictDoNothing();

  console.log("Seeding complete!");
  await client.end();
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
