import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../src/models/User.js";

dotenv.config();

const migrateUsers = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Update all users without role field to have default role
    const result = await User.updateMany(
      { role: { $exists: false } },
      {
        $set: {
          role: 'user',
          isActive: true,
          aiRequestsToday: 0,
          aiRequestsLimit: 100,
          lastAIRequestReset: new Date()
        }
      }
    );

    console.log(`✅ Migration completed!`);
    console.log(`   - Modified: ${result.modifiedCount} users`);
    console.log(`   - Matched: ${result.matchedCount} users`);

    // Get all users to verify
    const allUsers = await User.find({}, { name: 1, email: 1, role: 1, isActive: 1, aiRequestsLimit: 1 });
    console.log(`\n📋 Total users in database: ${allUsers.length}`);
    console.log("\n📊 User Summary:");
    allUsers.forEach((user, index) => {
      console.log(`   ${index + 1}. ${user.name} (${user.email}) - Role: ${user.role}, Status: ${user.isActive ? 'Active' : 'Suspended'}, AI Limit: ${user.aiRequestsLimit}`);
    });

    // Disconnect
    await mongoose.disconnect();
    console.log("\n✅ Migration script completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Migration failed:", error.message);
    process.exit(1);
  }
};

migrateUsers();

