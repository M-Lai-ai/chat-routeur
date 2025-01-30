import { generateResponse } from "./openai";

interface SearchConfig {
  engine: string;
  params: Record<string, string>;
  description: string;
}

const SEARCH_ENGINES: Record<string, SearchConfig> = {
  web: {
    engine: "google",
    params: {
      google_domain: "google.com",
      gl: "us",
      hl: "fr"
    },
    description: "Recherche web générale"
  },
  images: {
    engine: "google_images",
    params: {
      google_domain: "google.com",
      gl: "us",
      hl: "fr"
    },
    description: "Recherche d'images"
  },
  jobs: {
    engine: "google_jobs",
    params: {
      google_domain: "google.com",
      hl: "fr"
    },
    description: "Recherche d'emplois"
  },
  shopping: {
    engine: "google_shopping",
    params: {
      google_domain: "google.com",
      hl: "fr"
    },
    description: "Recherche de produits"
  },
  scholar: {
    engine: "google_scholar",
    params: {
      hl: "fr"
    },
    description: "Recherche d'articles académiques"
  },
  videos: {
    engine: "google_videos",
    params: {
      google_domain: "google.com",
      hl: "fr"
    },
    description: "Recherche de vidéos"
  },
  youtube: {
    engine: "youtube",
    params: {},
    description: "Recherche sur YouTube"
  }
};

const BASE_URL = "https://serpapi.com/search.json";

export async function searchGoogle(query: string, searchType: string = 'web') {
  try {
    if (!SEARCH_ENGINES[searchType]) {
      throw new Error(`Type de recherche non supporté: ${searchType}`);
    }

    const config = SEARCH_ENGINES[searchType];
    const params = new URLSearchParams({
      ...config.params,
      api_key: process.env.SERPAPI_KEY || "",
      engine: config.engine,
      ...(searchType === 'youtube' ? { search_query: query } : { q: query })
    });

    const response = await fetch(`${BASE_URL}?${params.toString()}`);

    if (!response.ok) {
      throw new Error(`Erreur API SerpAPI: ${response.statusText}`);
    }

    const data = await response.json();

    // Formater la réponse avec GPT
    const prompt = `Voici les résultats de recherche pour "${query}" (type: ${config.description}). Synthétisez les informations pertinentes.`;
    const formattedResponse = await generateResponse(data, prompt);

    return {
      message: formattedResponse,
      data: data
    };
  } catch (error) {
    console.error("SerpAPI error:", error);
    return {
      message: "Désolé, je n'ai pas pu effectuer la recherche. Veuillez réessayer.",
      error: error.message
    };
  }
}

export function getAvailableSearchTypes(): Record<string, string> {
  return Object.entries(SEARCH_ENGINES).reduce((acc, [key, config]) => ({
    ...acc,
    [key]: config.description
  }), {});
}