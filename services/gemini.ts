import { GoogleGenAI, Type, type Schema } from "@google/genai";
import { MPProfile, GlobalStats } from "../types";

// Static data based on 2024 General Election analysis
const STATIC_STATS: GlobalStats = {
  parties: [
    { partyName: "Conservative", privateSchoolPercent: 46, oxbridgePercent: 38, avgPoshScore: 82, color: "#0087DC" },
    { partyName: "Labour", privateSchoolPercent: 17, oxbridgePercent: 20, avgPoshScore: 42, color: "#E4003B" },
    { partyName: "Lib Dem", privateSchoolPercent: 28, oxbridgePercent: 26, avgPoshScore: 64, color: "#FAA61A" },
    { partyName: "Reform UK", privateSchoolPercent: 25, oxbridgePercent: 10, avgPoshScore: 58, color: "#12B6CF" },
    { partyName: "Green", privateSchoolPercent: 14, oxbridgePercent: 18, avgPoshScore: 48, color: "#02A95B" }
  ],
  regions: [
    { id: "london", name: "London", avgPoshScore: 75, privateSchoolPercent: 30, notableConstituency: "Kensington" },
    { id: "se", name: "South East", avgPoshScore: 80, privateSchoolPercent: 35, notableConstituency: "Henley" },
    { id: "sw", name: "South West", avgPoshScore: 65, privateSchoolPercent: 25, notableConstituency: "North East Somerset" },
    { id: "midlands", name: "Midlands", avgPoshScore: 55, privateSchoolPercent: 15, notableConstituency: "Birmingham Ladywood" },
    { id: "east", name: "East of England", avgPoshScore: 68, privateSchoolPercent: 22, notableConstituency: "South West Norfolk" },
    { id: "north", name: "The North", avgPoshScore: 45, privateSchoolPercent: 10, notableConstituency: "Richmond (Yorks)" },
    { id: "scotland", name: "Scotland", avgPoshScore: 50, privateSchoolPercent: 18, notableConstituency: "Edinburgh South" },
    { id: "wales", name: "Wales", avgPoshScore: 40, privateSchoolPercent: 8, notableConstituency: "Monmouth" },
    { id: "ni", name: "Northern Ireland", avgPoshScore: 45, privateSchoolPercent: 12, notableConstituency: "North Down" }
  ],
  totalPrivateSchool: 23,
  totalOxbridge: 19,
  summary: "Following the 2024 General Election, the House of Commons is less privately educated than at any point in history. However, a significant class divide remains, with Conservatives still disproportionately drawn from fee-paying schools compared to the Labour intake.",
  notableMPs: [
    { name: "Rishi Sunak", party: "Conservative", poshScore: 94, reason: "Head Boy at Winchester College, Oxford PPE, Goldman Sachs, and a billionaire heiress wife." },
    { name: "Nigel Farage", party: "Reform UK", poshScore: 85, reason: "Dulwich College alumnus and commodities trader who plays the man of the people." },
    { name: "Ed Davey", party: "Lib Dem", poshScore: 72, reason: "Nottingham High School (Private) and Oxford. A quiet, classic establishment background." },
    { name: "Keir Starmer", party: "Labour", poshScore: 68, reason: "Reigate Grammar (selective/private), Leeds, and Oxford post-grad. A knight of the realm." },
    { name: "Victoria Atkins", party: "Conservative", poshScore: 88, reason: "Daughter of a Sir, Arnold School (Private), Cambridge, and a barrister." },
    { name: "Jess Phillips", party: "Labour", poshScore: 25, reason: "Comprehensive school, University of Leeds, and worked in business development." },
    { name: "Lee Anderson", party: "Reform UK", poshScore: 15, reason: "Coal miner's son, state educated, and worked in the pits himself." },
    { name: "Angela Rayner", party: "Labour", poshScore: 10, reason: "Left school at 16, care worker, trade unionist. The antithesis of the old boys' club." }
  ]
};

const mpSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING, description: "Full name of the MP" },
    party: { type: Type.STRING, description: "Political Party (e.g., Conservative, Labour)" },
    constituency: { type: Type.STRING, description: "The constituency they represent" },
    education: {
      type: Type.OBJECT,
      properties: {
        secondary: { type: Type.STRING, description: "Name of secondary school attended" },
        university: { type: Type.STRING, description: "University and College attended (if any)" },
        schoolType: { type: Type.STRING, description: "One of: Private, Grammar, State, Unknown" },
      },
      required: ["secondary", "university", "schoolType"]
    },
    previousJobs: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of significant jobs before becoming an MP"
    },
    poshScore: {
      type: Type.NUMBER,
      description: "A calculated score from 0 (Working class) to 100 (Aristocratic) based on education, wealth, and background."
    },
    poshAnalysis: {
      type: Type.STRING,
      description: "A witty, satirical, yet factual paragraph explaining why they received this score."
    },
    netWorthEstimate: {
      type: Type.STRING,
      description: "A broad estimate of wealth or notable financial background info if available (e.g., 'Multi-millionaire', 'Standard MP Salary')."
    }
  },
  required: ["name", "party", "education", "poshScore", "poshAnalysis"]
};

let aiInstance: GoogleGenAI | null = null;

const getAI = () => {
  if (!aiInstance) {
    aiInstance = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return aiInstance;
};

export const analyzeMP = async (input: string, isLocation: boolean = false): Promise<MPProfile> => {
  const ai = getAI();
  const model = "gemini-3-pro-preview"; 
  
  let prompt;
  if (isLocation) {
    prompt = `
      First, identify the current UK Member of Parliament for the location or coordinates: "${input}".
      If it is a city name, pick the most prominent constituency. 
      Then, find detailed background information for that specific MP.
      
      Focus on their educational history (High school/College), University, and pre-parliamentary career.
      Determine if their school was Private (Fee-paying), Grammar (Selective State), or State (Comprehensive).
      
      Calculate a "Posh Score" (0-100) based on:
      - Attending Eton, Harrow, Winchester, etc. (+40 points)
      - Attending any other Private School (+20 points)
      - Attending Oxbridge (+30 points)
      - Working in Finance, Law, or consulting (+10 points)
      - Hereditary titles or wealthy background (+20 points)
      - Subtract points for State school, working class roots, trade union background.
      
      Be factual but write the 'poshAnalysis' in a witty, slightly satirical tone appropriate for a site called "Members of Posh".
    `;
  } else {
    prompt = `
      Find detailed background information for the UK Member of Parliament (MP) named "${input}".
      Focus on their educational history (High school/College), University, and pre-parliamentary career.
      
      Determine if their school was Private (Fee-paying), Grammar (Selective State), or State (Comprehensive).
      
      Calculate a "Posh Score" (0-100) based on:
      - Attending Eton, Harrow, Winchester, etc. (+40 points)
      - Attending any other Private School (+20 points)
      - Attending Oxbridge (+30 points)
      - Working in Finance, Law, or consulting (+10 points)
      - Hereditary titles or wealthy background (+20 points)
      - Subtract points for State school, working class roots, trade union background.
      
      Be factual but write the 'poshAnalysis' in a witty, slightly satirical tone appropriate for a site called "Members of Posh".
    `;
  }

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: mpSchema,
        thinkingConfig: { thinkingBudget: 1024 }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as MPProfile;
  } catch (error) {
    console.error("Error analyzing MP:", error);
    throw error;
  }
};

export const getGeneralStats = async (): Promise<GlobalStats> => {
  return Promise.resolve(STATIC_STATS);
};