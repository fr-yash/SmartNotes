import pdfParse from "pdf-parse/lib/pdf-parse.js";
import fs from "fs";
import path from "path";
import Note from "../models/Note.js";

export const uploadPDF = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No PDF file uploaded" });
    const dataBuffer = fs.readFileSync(req.file.path);
    const pdfData = await pdfParse(dataBuffer);
    const text = pdfData.text;

    // Derive a title: prefer filename (without extension), fallback to first line of text or default
    const filenameTitle = req.file?.originalname ? path.parse(req.file.originalname).name : "";
    const textFirstLine = (text || "").trim().split(/\r?\n/)[0]?.slice(0, 80) || "";
    const title = filenameTitle || textFirstLine || "Imported PDF";

    // Save as note for user
    const note = new Note({ title, content: text, user: req.userId });
    await note.save();
    // Remove uploaded file after parsing
    fs.unlinkSync(req.file.path);
    res.json({ text, note });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
