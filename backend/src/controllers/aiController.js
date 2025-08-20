import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
const modelName = process.env.GENAI_MODEL || "gemini-1.5-flash";
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

// Summarize Note
export const summarizeNote = async (req, res) => {
  try {
    if (!genAI) return res.status(500).json({ message: "AI not configured: set GEMINI_API_KEY in backend environment." });
    const { content } = req.body;
    if (!content) return res.status(400).json({ message: "Content is required" });

    const model = genAI.getGenerativeModel({ model: modelName });
    const result = await model.generateContent(`Summarize this note:\n\n${content}`);

    res.json({ summary: result.response.text() });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Extract Keywords
export const extractKeywords = async (req, res) => {
  try {
    if (!genAI) return res.status(500).json({ message: "AI not configured: set GEMINI_API_KEY in backend environment." });
    const { content } = req.body;
    if (!content) return res.status(400).json({ message: "Content is required" });

    const model = genAI.getGenerativeModel({ model: modelName });
    const result = await model.generateContent(
      `Extract important keywords from this note. Return them as a comma-separated list:\n\n${content}`
    );

    res.json({ keywords: result.response.text() });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Rewrite / Improve Note
export const rewriteNote = async (req, res) => {
  try {
    if (!genAI) return res.status(500).json({ message: "AI not configured: set GEMINI_API_KEY in backend environment." });
    const { content } = req.body;
    if (!content) return res.status(400).json({ message: "Content is required" });

    const model = genAI.getGenerativeModel({ model: modelName });
    const result = await model.generateContent(
      `Rewrite this note in a clearer and more concise way:\n\n${content}`
    );

    res.json({ rewritten: result.response.text() });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Ask a question about a note's content
export const askAboutNote = async (req, res) => {
  try {
    if (!genAI) return res.status(500).json({ message: "AI not configured: set GEMINI_API_KEY in backend environment." });
    const { content, question } = req.body;
    if (!content || !question) return res.status(400).json({ message: "Both content and question are required" });

    const model = genAI.getGenerativeModel({ model: modelName });
    const prompt = `You are a helpful study assistant. Using ONLY the following note content, answer the user's question clearly and concisely.\n\n--- NOTE CONTENT START ---\n${content}\n--- NOTE CONTENT END ---\n\nQuestion: ${question}`;
    const result = await model.generateContent(prompt);
    res.json({ answer: result.response.text() });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Generate a multiple-choice quiz from a note
export const generateQuiz = async (req, res) => {
  try {
    if (!genAI) return res.status(500).json({ message: "AI not configured: set GEMINI_API_KEY in backend environment." });
    const { content, numQuestions } = req.body;
    if (!content) return res.status(400).json({ message: "Content is required" });

    const n = Math.min(Math.max(parseInt(numQuestions || 5, 10) || 5, 3), 15);
    const model = genAI.getGenerativeModel({ model: modelName });
    const prompt = `Create a multiple choice quiz with ${n} questions based on the note content below.\n\nReturn ONLY raw JSON (no Markdown, no backticks) matching exactly this schema: { "questions": [ { "question": string, "options": [string, string, string, string], "correctIndex": number, "explanation": string } ] }.\n- Ensure exactly 4 options per question.\n- "correctIndex" must be an integer 0-3.\n- Keep explanations concise.\n\nNote content:\n${content}`;
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    const tryParse = (raw) => {
      try {
        const q = JSON.parse(raw);
        if (q && Array.isArray(q.questions)) return q;
      } catch {}
      return null;
    };

    // Attempt direct parse
    let quiz = tryParse(text);

    // Try to extract JSON from code fences
    if (!quiz) {
      const fenceMatch = text.match(/```(?:json)?\n([\s\S]*?)\n```/i);
      if (fenceMatch) quiz = tryParse(fenceMatch[1]);
    }

    // Try widest braces slice
    if (!quiz) {
      const first = text.indexOf('{');
      const last = text.lastIndexOf('}');
      if (first !== -1 && last !== -1 && last > first) {
        quiz = tryParse(text.slice(first, last + 1));
      }
    }

    if (quiz) return res.json({ quiz });
    return res.json({ quizText: text });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
