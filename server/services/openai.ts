import OpenAI from "openai";
import { getAvailableEndpoints } from "./financial";
import { getAvailableSearchTypes } from "./serp";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface MessageAnalysis {
  type: "web_search" | "financial" | "general";
  symbol?: string;
  endpoints?: string[];
  searchType?: string;
}

export async function analyzeMessage(message: string): Promise<MessageAnalysis | { message: string }> {
  try {
    const financialEndpoints = getAvailableEndpoints();
    const searchTypes = getAvailableSearchTypes();

    const endpointDescriptions = Object.entries(financialEndpoints)
      .map(([key, value]) => `${key}: ${value.description}`)
      .join('\n');

    const searchTypeDescriptions = Object.entries(searchTypes)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n');

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `Analysez le message de l'utilisateur et déterminez s'il nécessite une recherche web, des données financières ou une réponse générale.

Pour les requêtes financières :
1. Extrayez le symbole boursier
2. Sélectionnez les endpoints pertinents parmi :
${endpointDescriptions}

Pour les recherches web :
1. Sélectionnez le type de recherche le plus approprié parmi :
${searchTypeDescriptions}

Répondez en JSON avec le format :
{
  "type": "web_search" | "financial" | "general",
  "symbol": "string" (pour les requêtes financières),
  "endpoints": ["endpoint1", "endpoint2"] (liste des endpoints pertinents),
  "searchType": "string" (type de recherche pour les requêtes web)
}`
        },
        {
          role: "user",
          content: message
        }
      ],
      response_format: { type: "json_object" }
    });

    const content = response.choices[0].message.content;
    if (!content) {
      return { message: "Je n'ai pas pu analyser votre message. Veuillez réessayer." };
    }

    return JSON.parse(content) as MessageAnalysis;
  } catch (error) {
    console.error("OpenAI API error:", error);
    return { message: "Je suis désolé, mais je ne peux pas traiter votre message pour le moment." };
  }
}

export async function generateResponse(context: any, query: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "Vous êtes un assistant expert. Utilisez le contexte fourni pour répondre à la question de l'utilisateur. Répondez toujours en français avec un langage clair et professionnel."
        },
        {
          role: "user",
          content: JSON.stringify({ context, query })
        }
      ]
    });

    return response.choices[0].message.content || "Je n'ai pas pu générer une réponse.";
  } catch (error) {
    console.error("OpenAI API error:", error);
    return "Je suis désolé, mais je ne peux pas générer une réponse pour le moment.";
  }
}