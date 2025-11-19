import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Chapter, ChapterContent } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

const SYLLABUS_PROMPT = `
You are a senior browser engine architect. 
Create a comprehensive 10-chapter course curriculum for a software engineer to learn how a browser works by building a toy browser engine from scratch.
The course should be progressive, starting from networking and ending with a basic rendering engine.
Topics must include: HTTP/Networking, HTML Parsing (Tokenization/Tree Construction), CSS Parsing, Style Calculation, Layout (Box Model), and Painting.
Return the response in JSON format.
`;

const CHAPTER_CONTENT_PROMPT = (chapterTitle: string, description: string) => `
You are a senior browser engine architect teaching a course.
Generate the detailed content for the chapter: "${chapterTitle}".
Context: ${description}.
The user is building a browser engine in TypeScript/Node.js.

Return a JSON object with:
1. "theory": A detailed markdown explanation of the concepts (approx 400 words). Use analogies and technical depth.
2. "assignment": A programming assignment. 
   - "title": Title of the task.
   - "description": Step-by-step instructions on what to implement.
   - "starterCode": TypeScript code snippet to start with.
   - "expectedOutput": What the console should print or result should be.
3. "quiz": An array of 3 multiple choice questions to test understanding.
   - "question": The question string.
   - "options": Array of 4 strings.
   - "correctAnswerIndex": 0-3.
   - "explanation": Why the answer is correct.
`;

export const generateSyllabus = async (): Promise<Chapter[]> => {
  if (!apiKey) throw new Error("API Key not found");

  const schema: Schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        id: { type: Type.INTEGER },
        title: { type: Type.STRING },
        shortDescription: { type: Type.STRING },
      },
      required: ["id", "title", "shortDescription"],
    },
  };

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: SYLLABUS_PROMPT,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        temperature: 0.3,
      },
    });

    const data = JSON.parse(response.text || "[]");
    return data.map((item: any) => ({
      ...item,
      isCompleted: false,
      content: null,
      isLoading: false,
    }));
  } catch (error) {
    console.error("Failed to generate syllabus:", error);
    throw new Error("Failed to generate course syllabus. Please try again.");
  }
};

export const generateChapterContent = async (chapter: Chapter): Promise<ChapterContent> => {
  if (!apiKey) throw new Error("API Key not found");

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      theory: { type: Type.STRING },
      assignment: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          starterCode: { type: Type.STRING },
          expectedOutput: { type: Type.STRING },
        },
        required: ["title", "description", "starterCode", "expectedOutput"],
      },
      quiz: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            options: { type: Type.ARRAY, items: { type: Type.STRING } },
            correctAnswerIndex: { type: Type.INTEGER },
            explanation: { type: Type.STRING },
          },
          required: ["question", "options", "correctAnswerIndex", "explanation"],
        },
      },
    },
    required: ["theory", "assignment", "quiz"],
  };

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: CHAPTER_CONTENT_PROMPT(chapter.title, chapter.shortDescription),
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        temperature: 0.4, // Slightly higher for creative educational content
      },
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Failed to generate chapter content:", error);
    throw new Error("Failed to load chapter content.");
  }
};