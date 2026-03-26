import dotenv from "dotenv";
dotenv.config();

import { GoogleGenerativeAI } from "@google/generative-ai";
import { buildDirectionsPrompt } from "../utils/prompts.js";
import { parseJsonResponse } from "../utils/parseJson.js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function generateDirectionsFromBrief(brief) {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
  });

  const prompt = buildDirectionsPrompt(brief);

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  return parseJsonResponse(text);
}