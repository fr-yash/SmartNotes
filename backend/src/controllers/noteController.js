import Note from "../models/Note.js";

// Create Note
export const createNote = async (req, res) => {
  try {
    const { title, content } = req.body;
    const note = new Note({ title, content, user: req.userId });
    await note.save();
    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Notes (only logged-in user’s notes)
export const getNotes = async (req, res) => {
  try {
    const notes = await Note.find({
      $or: [
        { user: req.userId },
        { sharedWith: req.userId }
      ]
    }).sort({ createdAt: -1 });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Note
export const updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    const note = await Note.findOneAndUpdate(
      { _id: id, user: req.userId }, // ensure user owns this note
      { title, content },
      { new: true }
    );

    if (!note) return res.status(404).json({ message: "Note not found" });

    res.json(note);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Share Note with another user
export const shareNote = async (req, res) => {
  try {
    const { id } = req.params; // note id
    const { email } = req.body; // target user's email

    if (!email) return res.status(400).json({ message: "Recipient email is required" });

    // Only the owner can share
    const note = await Note.findOne({ _id: id, user: req.userId });
    if (!note) return res.status(404).json({ message: "Note not found or not owned by user" });

    const User = (await import('../models/User.js')).default;
    const recipient = await User.findOne({ email });
    if (!recipient) return res.status(404).json({ message: "Recipient user not found" });

    // Avoid duplicates
    if (!note.sharedWith.some(uid => uid.toString() === recipient._id.toString())) {
      note.sharedWith.push(recipient._id);
      await note.save();
    }

    res.json({ message: "Note shared successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Note
export const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;

    const note = await Note.findOneAndDelete({ _id: id, user: req.userId });

    if (!note) return res.status(404).json({ message: "Note not found" });

    res.json({ message: "Note deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
