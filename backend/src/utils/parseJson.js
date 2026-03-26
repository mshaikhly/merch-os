export function parseJsonResponse(text) {
  try {
    return JSON.parse(text);
  } catch (error) {
    const cleaned = text
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(cleaned);
  }
}