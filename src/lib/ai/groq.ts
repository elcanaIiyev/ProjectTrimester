import { createGroq } from "@ai-sdk/groq";

export const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
});

export const GROQ_MODELS = [
  "llama-3.3-70b-versatile",
  "llama-3.1-8b-instant",
  "gemma2-9b-it",
  "llama3-70b-8192",
];
