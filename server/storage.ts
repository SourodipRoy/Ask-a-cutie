
import { db } from "./db";
import { requests, type InsertRequest, type Request } from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  createRequest(request: InsertRequest): Promise<Request>;
  getRequest(id: number): Promise<Request | undefined>;
}

export class DatabaseStorage implements IStorage {
  async createRequest(insertRequest: InsertRequest): Promise<Request> {
    const [result] = await db.insert(requests).values(insertRequest).returning();
    return result;
  }

  async getRequest(id: number): Promise<Request | undefined> {
    const [result] = await db.select().from(requests).where(eq(requests.id, id));
    return result;
  }
}

export const storage = new DatabaseStorage();
