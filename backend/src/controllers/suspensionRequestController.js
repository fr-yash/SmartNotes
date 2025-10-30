import SuspensionRequest from "../models/SuspensionRequest.js";
import User from "../models/User.js";

// Submit a suspension appeal request (for suspended users)
export const submitSuspensionRequest = async (req, res) => {
  try {
    const { reason } = req.body;
    const userId = req.userId;

    if (!reason || reason.trim().length === 0) {
      return res.status(400).json({ message: "Reason is required" });
    }

    if (reason.trim().length < 10) {
      return res.status(400).json({ message: "Reason must be at least 10 characters" });
    }

    // Get user details
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if user is actually suspended
    if (user.isActive) {
      return res.status(400).json({ message: "Only suspended users can submit appeals" });
    }

    // Check if user already has a pending request
    const existingRequest = await SuspensionRequest.findOne({
      user: userId,
      status: 'pending'
    });

    if (existingRequest) {
      return res.status(400).json({ 
        message: "You already have a pending appeal request. Please wait for admin response." 
      });
    }

    // Create new suspension request
    const suspensionRequest = new SuspensionRequest({
      user: userId,
      userEmail: user.email,
      userName: user.name,
      reason: reason.trim(),
    });

    await suspensionRequest.save();

    res.status(201).json({
      message: "Appeal request submitted successfully. An admin will review it soon.",
      request: suspensionRequest
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user's suspension requests (for suspended users)
export const getUserSuspensionRequests = async (req, res) => {
  try {
    const userId = req.userId;

    const requests = await SuspensionRequest.find({ user: userId })
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all suspension requests (admin only)
export const getAllSuspensionRequests = async (req, res) => {
  try {
    const requests = await SuspensionRequest.find()
      .populate('user', 'name email')
      .populate('resolvedBy', 'name email')
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Approve suspension request (admin only)
export const approveSuspensionRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { response } = req.body;
    const adminId = req.user._id;

    const suspensionRequest = await SuspensionRequest.findById(requestId);
    if (!suspensionRequest) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (suspensionRequest.status !== 'pending') {
      return res.status(400).json({ message: "Request has already been resolved" });
    }

    // Activate the user
    const user = await User.findById(suspensionRequest.user);
    if (user) {
      user.isActive = true;
      await user.save();
    }

    // Update request
    suspensionRequest.status = 'approved';
    suspensionRequest.adminResponse = response || 'Your account has been reactivated.';
    suspensionRequest.resolvedAt = new Date();
    suspensionRequest.resolvedBy = adminId;
    await suspensionRequest.save();

    res.json({
      message: "Suspension request approved and user reactivated",
      request: suspensionRequest
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Reject suspension request (admin only)
export const rejectSuspensionRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { response } = req.body;
    const adminId = req.user._id;

    if (!response || response.trim().length === 0) {
      return res.status(400).json({ message: "Response is required when rejecting" });
    }

    const suspensionRequest = await SuspensionRequest.findById(requestId);
    if (!suspensionRequest) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (suspensionRequest.status !== 'pending') {
      return res.status(400).json({ message: "Request has already been resolved" });
    }

    // Update request
    suspensionRequest.status = 'rejected';
    suspensionRequest.adminResponse = response.trim();
    suspensionRequest.resolvedAt = new Date();
    suspensionRequest.resolvedBy = adminId;
    await suspensionRequest.save();

    res.json({
      message: "Suspension request rejected",
      request: suspensionRequest
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

