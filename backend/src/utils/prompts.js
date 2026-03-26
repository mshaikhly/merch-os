export function buildDirectionsPrompt(brief) {
  return `
You are a senior streetwear creative director.

Generate exactly 3 distinct merch design directions based on the client brief.

The directions must feel suitable for a modern apparel brand and should be visually clear enough that a designer could create mockups from them.

Return valid JSON only. Do not wrap in markdown. Do not include explanation outside JSON.

Each direction must include:
- id
- title
- hook
- concept
- visualStyle
- typography
- colourPalette
- graphicElements
- frontDesign
- backDesign
- placementNotes
- printStyle
- referenceVibe
- rationale

Return this format:
{
  "directions": [
    {
      "id": "direction-1",
      "title": "",
      "hook": "",
      "concept": "",
      "visualStyle": "",
      "typography": "",
      "colourPalette": ["", ""],
      "graphicElements": ["", ""],
      "frontDesign": "",
      "backDesign": "",
      "placementNotes": "",
      "printStyle": "",
      "referenceVibe": "",
      "rationale": ""
    }
  ]
}

Client brief:
${JSON.stringify(brief, null, 2)}
`;
}