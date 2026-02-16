import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import Database from "better-sqlite3";
import { createApp } from "../src/app.js";

function setup() {
  const db = new Database(":memory:");
  const app = createApp(db);
  return { db, app };
}

describe("Cities API", () => {
  let app: ReturnType<typeof createApp>;

  beforeEach(() => {
    ({ app } = setup());
  });

  describe("POST /api/cities", () => {
    it("should create a city", async () => {
      const res = await request(app).post("/api/cities").send({
        name: "Portland",
        state: "Oregon",
        country: "United States",
        touristRating: 4,
        dateEstablished: "1851-02-08",
        estimatedPopulation: 652503,
      });

      expect(res.status).toBe(201);
      expect(res.body.id).toBeDefined();
      expect(res.body.name).toBe("Portland");
      expect(res.body.touristRating).toBe(4);
    });

    it("should reject invalid input", async () => {
      const res = await request(app).post("/api/cities").send({
        name: "Portland",
      });

      expect(res.status).toBe(400);
      expect(res.body.errors).toBeDefined();
    });

    it("should reject touristRating out of range", async () => {
      const res = await request(app).post("/api/cities").send({
        name: "Portland",
        state: "Oregon",
        country: "United States",
        touristRating: 6,
        dateEstablished: "1851-02-08",
        estimatedPopulation: 652503,
      });

      expect(res.status).toBe(400);
    });
  });

  describe("PUT /api/cities/:id", () => {
    it("should update a city", async () => {
      const create = await request(app).post("/api/cities").send({
        name: "Portland",
        state: "Oregon",
        country: "United States",
        touristRating: 4,
        dateEstablished: "1851-02-08",
        estimatedPopulation: 652503,
      });

      const res = await request(app)
        .put(`/api/cities/${create.body.id}`)
        .send({ touristRating: 5, estimatedPopulation: 700000 });

      expect(res.status).toBe(200);
      expect(res.body.touristRating).toBe(5);
      expect(res.body.estimatedPopulation).toBe(700000);
    });

    it("should return 404 for non-existent city", async () => {
      const res = await request(app).put("/api/cities/999").send({ touristRating: 3 });
      expect(res.status).toBe(404);
    });
  });

  describe("DELETE /api/cities/:id", () => {
    it("should delete a city", async () => {
      const create = await request(app).post("/api/cities").send({
        name: "Portland",
        state: "Oregon",
        country: "United States",
        touristRating: 4,
        dateEstablished: "1851-02-08",
        estimatedPopulation: 652503,
      });

      const res = await request(app).delete(`/api/cities/${create.body.id}`);
      expect(res.status).toBe(204);
    });

    it("should return 404 for non-existent city", async () => {
      const res = await request(app).delete("/api/cities/999");
      expect(res.status).toBe(404);
    });
  });

  describe("GET /api/cities/search", () => {
    it("should search cities by name", async () => {
      await request(app).post("/api/cities").send({
        name: "Portland",
        state: "Oregon",
        country: "United States",
        touristRating: 4,
        dateEstablished: "1851-02-08",
        estimatedPopulation: 652503,
      });

      await request(app).post("/api/cities").send({
        name: "Seattle",
        state: "Washington",
        country: "United States",
        touristRating: 5,
        dateEstablished: "1851-11-13",
        estimatedPopulation: 749256,
      });

      const res = await request(app).get("/api/cities/search?name=port");
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
      expect(res.body[0].name).toBe("Portland");
    });

    it("should return 400 without name parameter", async () => {
      const res = await request(app).get("/api/cities/search");
      expect(res.status).toBe(400);
    });
  });
});
