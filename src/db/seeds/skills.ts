import { db } from "@/db";
import seedData from "./data/skills.json" with { type: "json" };
import { skills } from "../schema";

export default async function seedSkills(db: db) {
  console.log("🌱 Seeding skills...");

  // Insert seed data
  await db
    .insert(skills)
    .values(seedData)
    .onConflictDoNothing({ target: skills.title })
    .returning();
  console.log(`✅ Inserted ${seedData.length} skills successfully`);
}
