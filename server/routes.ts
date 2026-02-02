import type { Express } from "express";
import type { Server } from "http";

export async function registerRoutes(
  httpServer: Server,
  _app: Express
): Promise<Server> {
  // Stateless version: No API routes needed as all data is in the URL
  return httpServer;
}
