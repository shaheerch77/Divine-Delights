// scripts/seedAdmin.ts

import { MongoClient } from "mongodb";
import bcrypt from "bcryptjs";

async function seedAdmin() {
  const client = new MongoClient("mongodb://localhost:27017");

  try {
    await client.connect();
    const db = client.db("divine-delights");

    const adminEmail = "admin@divinedelights.com";

    // Check if admin already exists
    const existing = await db.collection("users").findOne({ email: adminEmail });
    if (existing) {
      console.log("⚠️ Admin already exists.");
      return;
    }

    // Create Admin User
    const hashedPassword = await bcrypt.hash("Admin123!", 10);

    const result = await db.collection("users").insertOne({
      name: "Divine Admin",
      email: adminEmail,
      password: hashedPassword,
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    console.log("✅ Admin created successfully!");
    console.log("🆔 ID:", result.insertedId);
    console.log("📧 Email:", adminEmail);
    console.log("🔑 Password: Admin123!");
  } catch (err) {
    console.error("❌ Error seeding admin:", err);
  } finally {
    await client.close();
  }
}

seedAdmin();
