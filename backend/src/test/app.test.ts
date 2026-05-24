import request from "supertest";
import { describe, expect, test } from "vitest";
import { createApp } from "../app";
import { createTestPrisma } from "./test-prisma";

const userPayload = {
  fullName: "Jane Broker",
  email: "jane@example.com",
  password: "secret123",
  confirmPassword: "secret123",
};

const brokerPayload = {
  name: "Exness Global",
  slug: "exness-global",
  description: "A CFD broker with global coverage.",
  logoUrl: "https://example.com/logo.png",
  website: "https://example.com",
  brokerType: "cfd",
};

function setup() {
  const prisma = createTestPrisma();
  return { prisma, app: createApp({ prisma: prisma as never }) };
}

async function registerAndLogin(agent: request.SuperAgentTest) {
  await agent.post("/api/register").send(userPayload).expect(201);
  await agent.post("/api/login").send({ email: userPayload.email, password: userPayload.password }).expect(200);
}

describe("backend API contract", () => {
  test("GET /api/health reports readiness", async () => {
    const { app } = setup();

    const res = await request(app).get("/api/health").expect(200);

    expect(res.body).toEqual({ ok: true, service: "woxa-broker-api" });
  });

  test("register rejects duplicate emails and never returns password hashes", async () => {
    const { app } = setup();

    const created = await request(app).post("/api/register").send(userPayload).expect(201);
    const duplicate = await request(app).post("/api/register").send(userPayload).expect(409);

    expect(created.body.user).toMatchObject({ email: userPayload.email, fullName: userPayload.fullName });
    expect(created.body.user.password).toBeUndefined();
    expect(duplicate.body).toMatchObject({ error: "Email already registered", code: "EMAIL_EXISTS" });
  });

  test("login sets auth cookie, me returns current user, and logout clears the session", async () => {
    const { app } = setup();
    const agent = request.agent(app);

    await agent.post("/api/register").send(userPayload).expect(201);
    const login = await agent.post("/api/login").send({ email: userPayload.email, password: userPayload.password }).expect(200);
    const me = await agent.get("/api/me").expect(200);
    await agent.post("/api/logout").expect(200);
    const afterLogout = await agent.get("/api/me").expect(401);

    expect(login.body.token).toEqual(expect.any(String));
    expect(login.body.token.length).toBeGreaterThan(20);
    expect(me.body.user).toMatchObject({ email: userPayload.email, fullName: userPayload.fullName });
    expect(afterLogout.body).toMatchObject({ error: "Unauthorized", code: "UNAUTHORIZED" });
  });

  test("POST /api/brokers requires authentication and validates broker payloads", async () => {
    const { app } = setup();
    const agent = request.agent(app);

    const unauthorized = await request(app).post("/api/brokers").send(brokerPayload).expect(401);
    await registerAndLogin(agent);
    const invalid = await agent.post("/api/brokers").send({ ...brokerPayload, website: "not-a-url" }).expect(400);
    const created = await agent.post("/api/brokers").send(brokerPayload).expect(201);
    const duplicate = await agent.post("/api/brokers").send(brokerPayload).expect(409);

    expect(unauthorized.body).toMatchObject({ error: "Unauthorized", code: "UNAUTHORIZED" });
    expect(invalid.body.code).toBe("VALIDATION_ERROR");
    expect(created.body.broker).toMatchObject({ slug: brokerPayload.slug, brokerType: "cfd" });
    expect(created.body.broker).toMatchObject({ logo_url: brokerPayload.logoUrl, broker_type: "cfd" });
    expect(duplicate.body).toMatchObject({ error: "Slug already exists", code: "SLUG_EXISTS" });
  });

  test("POST /api/brokers accepts snake_case broker fields from assignment payloads", async () => {
    const { app } = setup();
    const agent = request.agent(app);
    await registerAndLogin(agent);

    const created = await agent.post("/api/brokers").send({
      name: "Snake Case Broker",
      slug: "snake-case-broker",
      description: "A broker submitted with assignment-style field names.",
      logo_url: "https://example.com/snake-logo.png",
      website: "https://example.com/snake",
      broker_type: "stock",
    }).expect(201);

    expect(created.body.broker).toMatchObject({
      slug: "snake-case-broker",
      logoUrl: "https://example.com/snake-logo.png",
      brokerType: "stock",
      logo_url: "https://example.com/snake-logo.png",
      broker_type: "stock",
    });
  });

  test("POST /api/brokers accepts bearer JWT authorization", async () => {
    const { app } = setup();
    await request(app).post("/api/register").send(userPayload).expect(201);
    const login = await request(app)
      .post("/api/login")
      .send({ email: userPayload.email, password: userPayload.password })
      .expect(200);

    const created = await request(app)
      .post("/api/brokers")
      .set("Authorization", `Bearer ${login.body.token}`)
      .send({ ...brokerPayload, slug: "bearer-authorized-broker" })
      .expect(201);

    expect(created.body.broker).toMatchObject({ slug: "bearer-authorized-broker", broker_type: "cfd" });
  });

  test("GET /api/brokers supports case-insensitive search and broker type filtering", async () => {
    const { app } = setup();
    const agent = request.agent(app);
    await registerAndLogin(agent);
    await agent.post("/api/brokers").send(brokerPayload).expect(201);
    await agent.post("/api/brokers").send({
      ...brokerPayload,
      name: "Bond House",
      slug: "bond-house",
      brokerType: "bond",
    }).expect(201);

    const search = await request(app).get("/api/brokers?search=EXNESS").expect(200);
    const filtered = await request(app).get("/api/brokers?type=bond").expect(200);
    const invalidType = await request(app).get("/api/brokers?type=forex").expect(400);

    expect(search.body.brokers).toHaveLength(1);
    expect(search.body.brokers[0].slug).toBe("exness-global");
    expect(filtered.body.brokers).toHaveLength(1);
    expect(filtered.body.brokers[0].brokerType).toBe("bond");
    expect(invalidType.body).toMatchObject({ error: "Invalid broker type", code: "VALIDATION_ERROR" });
  });

  test("GET /api/brokers/:slug returns broker detail or a stable 404", async () => {
    const { app } = setup();
    const agent = request.agent(app);
    await registerAndLogin(agent);
    await agent.post("/api/brokers").send(brokerPayload).expect(201);

    const detail = await request(app).get("/api/brokers/exness-global").expect(200);
    const missing = await request(app).get("/api/brokers/missing").expect(404);

    expect(detail.body.broker).toMatchObject({ slug: "exness-global" });
    expect(missing.body).toMatchObject({ error: "Broker not found", code: "BROKER_NOT_FOUND" });
  });
});
