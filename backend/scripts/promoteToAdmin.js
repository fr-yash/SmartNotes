import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../src/models/User.js";

dotenv.config();

const promoteToAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Get email from command line arguments
    const email = process.argv[2];

    if (!email) {
      console.log("❌ Please provide an email address");
      console.log("Usage: node scripts/promoteToAdmin.js <email>");
      console.log("\nExample: node scripts/promoteToAdmin.js yash@gmail.com");
      
      // Show all users
      const allUsers = await User.find({}, { name: 1, email: 1, role: 1 });
      console.log("\n📋 Available users:");
      allUsers.forEach((user, index) => {
        console.log(`   ${index + 1}. ${user.name} (${user.email}) - Current Role: ${user.role}`);
      });

      await mongoose.disconnect();
      process.exit(1);
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      console.log(`❌ User with email "${email}" not found`);
      
      // Show all users
      const allUsers = await User.find({}, { name: 1, email: 1, role: 1 });
      console.log("\n📋 Available users:");
      allUsers.forEach((user, index) => {
        console.log(`   ${index + 1}. ${user.name} (${user.email}) - Current Role: ${user.role}`);
      });

      await mongoose.disconnect();
      process.exit(1);
    }

    // Check if already admin
    if (user.role === 'admin') {
      console.log(`⚠️  User "${user.name}" is already an admin`);
      await mongoose.disconnect();
      process.exit(0);
    }

    // Promote to admin
    user.role = 'admin';
    await user.save();

    console.log(`✅ Successfully promoted "${user.name}" (${user.email}) to admin!`);
    console.log(`\n📊 User Details:`);
    console.log(`   - Name: ${user.name}`);
    console.log(`   - Email: ${user.email}`);
    console.log(`   - Role: ${user.role}`);
    console.log(`   - Status: ${user.isActive ? 'Active' : 'Suspended'}`);
    console.log(`   - AI Limit: ${user.aiRequestsLimit}`);

    // Disconnect
    await mongoose.disconnect();
    console.log("\n✅ Script completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

promoteToAdmin();

