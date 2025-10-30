import User from "../models/User.js";
import Note from "../models/Note.js";

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, '-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user by ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId, '-password');
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Suspend/Unsuspend user
export const toggleUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    
    if (!user) return res.status(404).json({ message: "User not found" });
    
    user.isActive = !user.isActive;
    await user.save();
    
    res.json({ 
      message: `User ${user.isActive ? 'activated' : 'suspended'} successfully`,
      user: user
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Don't allow deleting the last admin
    const adminCount = await User.countDocuments({ role: 'admin' });
    const user = await User.findById(userId);
    
    if (user.role === 'admin' && adminCount === 1) {
      return res.status(400).json({ message: "Cannot delete the last admin user" });
    }
    
    // Delete user's notes
    await Note.deleteMany({ user: userId });
    
    // Delete user
    await User.findByIdAndDelete(userId);
    
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user AI limit
export const updateAILimit = async (req, res) => {
  try {
    const { userId } = req.params;
    const { aiRequestsLimit } = req.body;
    
    if (!aiRequestsLimit || aiRequestsLimit < 0) {
      return res.status(400).json({ message: "Invalid AI requests limit" });
    }
    
    const user = await User.findByIdAndUpdate(
      userId,
      { aiRequestsLimit },
      { new: true }
    );
    
    if (!user) return res.status(404).json({ message: "User not found" });
    
    res.json({ message: "AI limit updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get analytics
export const getAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const adminUsers = await User.countDocuments({ role: 'admin' });
    const totalNotes = await Note.countDocuments();
    
    // Calculate AI requests today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const usersWithAIRequests = await User.aggregate([
      {
        $match: {
          lastAIRequestReset: { $gte: today }
        }
      },
      {
        $group: {
          _id: null,
          totalRequests: { $sum: "$aiRequestsToday" }
        }
      }
    ]);
    
    const totalAIRequests = usersWithAIRequests[0]?.totalRequests || 0;
    
    res.json({
      totalUsers,
      activeUsers,
      suspendedUsers: totalUsers - activeUsers,
      adminUsers,
      totalNotes,
      totalAIRequests,
      averageNotesPerUser: totalUsers > 0 ? (totalNotes / totalUsers).toFixed(2) : 0
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get featured note templates
export const getFeaturedTemplates = async (req, res) => {
  try {
    // For now, return empty array - can be extended to store templates in DB
    const templates = [
      {
        id: 1,
        title: "Biology Study Notes",
        description: "Template for biology topics with diagrams and definitions",
        category: "Science"
      },
      {
        id: 2,
        title: "History Timeline",
        description: "Template for organizing historical events chronologically",
        category: "History"
      },
      {
        id: 3,
        title: "Math Problem Solver",
        description: "Template for solving and explaining math problems step by step",
        category: "Mathematics"
      },
      {
        id: 4,
        title: "Literature Analysis",
        description: "Template for analyzing books, poems, and literary works",
        category: "Literature"
      }
    ];
    
    res.json(templates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Promote user to admin
export const promoteToAdmin = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findByIdAndUpdate(
      userId,
      { role: 'admin' },
      { new: true }
    );
    
    if (!user) return res.status(404).json({ message: "User not found" });
    
    res.json({ message: "User promoted to admin successfully", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Demote admin to user
export const demoteToUser = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Check if this is the last admin
    const adminCount = await User.countDocuments({ role: 'admin' });
    if (adminCount === 1) {
      return res.status(400).json({ message: "Cannot demote the last admin user" });
    }
    
    const user = await User.findByIdAndUpdate(
      userId,
      { role: 'user' },
      { new: true }
    );
    
    if (!user) return res.status(404).json({ message: "User not found" });
    
    res.json({ message: "User demoted to regular user successfully", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

