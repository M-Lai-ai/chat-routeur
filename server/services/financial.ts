import { generateResponse } from "./openai";

interface FinancialEndpoint {
  path: string;
  description: string;
}

const ENDPOINTS: Record<string, FinancialEndpoint> = {
  profile: {
    path: "/api/v3/profile/",
    description: "Informations générales sur l'entreprise"
  },
  quote: {
    path: "/api/v3/quote/",
    description: "Prix et données de trading en temps réel"
  },
  ratios: {
    path: "/api/v3/ratios/",
    description: "Ratios financiers trimestriels"
  },
  metrics: {
    path: "/api/v3/key-metrics/",
    description: "Métriques clés de l'entreprise"
  },
  metricsTTM: {
    path: "/api/v3/key-metrics-ttm/",
    description: "Métriques clés sur 12 mois glissants"
  },
  growth: {
    path: "/api/v3/financial-growth/",
    description: "Croissance financière"
  },
  dcf: {
    path: "/api/v3/discounted-cash-flow/",
    description: "Analyse des flux de trésorerie actualisés"
  },
  rating: {
    path: "/api/v3/rating/",
    description: "Notation et analyse des risques"
  },
  historicalRating: {
    path: "/api/v3/historical-rating/",
    description: "Historique des notations"
  },
  priceTarget: {
    path: "/api/v4/price-target-consensus/",
    description: "Consensus des objectifs de prix"
  },
  incomeStatement: {
    path: "/api/v3/income-statement/",
    description: "États des résultats annuels"
  },
  balanceSheet: {
    path: "/api/v3/balance-sheet-statement/",
    description: "Bilan financier annuel"
  },
  cashFlow: {
    path: "/api/v3/cash-flow-statement/",
    description: "État des flux de trésorerie"
  },
  pressReleases: {
    path: "/api/v3/press-releases/",
    description: "Communiqués de presse"
  },
  earningsSurprises: {
    path: "/api/v3/earnings-surprises/",
    description: "Surprises sur les résultats"
  }
};

const BASE_URL = "https://financialmodelingprep.com";

export async function getFinancialData(symbol: string, endpoints: string[] = ['profile', 'quote', 'ratios']) {
  try {
    const requests = endpoints.map(async (endpoint) => {
      if (!ENDPOINTS[endpoint]) {
        throw new Error(`Endpoint inconnu: ${endpoint}`);
      }

      const url = `${BASE_URL}${ENDPOINTS[endpoint].path}${symbol}?apikey=${process.env.FMP_API_KEY}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Erreur lors de la requête ${endpoint}: ${response.statusText}`);
      }

      const data = await response.json();
      return { [endpoint]: data };
    });

    const responses = await Promise.all(requests);
    const context = responses.reduce((acc, curr) => ({ ...acc, ...curr }), {});

    const response = await generateResponse(
      context,
      `Analyser les données financières pour ${symbol} en utilisant les endpoints: ${endpoints.join(', ')}`
    );

    return {
      message: response,
      data: context
    };
  } catch (error) {
    console.error("Financial API error:", error);
    throw new Error("Impossible de récupérer les données financières");
  }
}

export function getAvailableEndpoints(): Record<string, FinancialEndpoint> {
  return ENDPOINTS;
}