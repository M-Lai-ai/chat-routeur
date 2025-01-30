import type { Express } from "express";
import { createServer, type Server } from "http";
import { analyzeMessage } from "./services/openai";
import { searchGoogle } from "./services/serp";
import { getFinancialData } from "./services/financial";

export function registerRoutes(app: Express): Server {
  app.post("/api/chat", async (req, res) => {
    try {
      const { message } = req.body;

      // Get intent and type of query from OpenAI
      const analysis = await analyzeMessage(message);

      // If analysis returned an error message, send it directly
      if ('message' in analysis) {
        return res.json(analysis);
      }

      let response;
      switch (analysis.type) {
        case "web_search":
          response = await searchGoogle(message, analysis.searchType);
          break;
        case "financial":
          if (analysis.symbol) {
            response = await getFinancialData(analysis.symbol, analysis.endpoints);
          } else {
            response = { message: "Je n'ai pas pu identifier le symbole boursier dans votre message." };
          }
          break;
        default:
          response = await analyzeMessage(message);
      }

      res.json(response);
    } catch (error) {
      console.error("Chat error:", error);
      res.status(500).json({ message: "Une erreur est survenue. Veuillez réessayer." });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}