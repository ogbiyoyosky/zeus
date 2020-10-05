import request from "supertest";
import app from "../app";
const makeRequest = request(app);
import FixtureModel from "../models/Team";

let id;
let adminToken;
let userToken;
let InvalidToken;
let invalidRefreshToken = "nfjfnkrfmfkmkmfkmffmmfmmf";
let refreshToken;
let fixtureId;

beforeAll(async () => {
  await FixtureModel.deleteMany({});
});

describe("User  Mangement and Authentication", () => {
  test("should authenticate a user", async (done) => {
    const res: any = await makeRequest.post("/api/auth/signin").send({
      email: "user@gmail.com",
      password: "password",
    });
    userToken = res.body.results[0].accessToken;
    refreshToken = res.body.results[0].refreshToken;

    expect((res as any).status).toBe(200);
    expect((res as any).body.message).toBe("Successfully logged In");
    done();
  });

  test("should authenticate an admin", async (done) => {
    const res: any = await makeRequest.post("/api/auth/signin").send({
      email: "freeman@gmail.com",
      password: "password",
    });
    adminToken = res.body.results[0].accessToken;
    expect((res as any).status).toBe(200);
    expect((res as any).body.message).toBe("Successfully logged In");
    done();
  });

  test("should create a fixture", async (done) => {
    const res: any = await makeRequest
      .post("/api/fixtures")
      .send({
        homeTeam: [{ name: "Manchester City" }, { score: 0 }],
        awayTeam: [{ name: "Chelsea" }, { score: 0 }],
        details: [
          { matchTime: "2019-11-26T16:24:32.674+00:00" },
          { stadium: "Old Trafford" },
        ],
      })
      .set("authorization", `Bearer ${adminToken}`);

    fixtureId = res.body.results["_id"];

    expect((res as any).status).toBe(201);
    expect((res as any).body.message).toBe("Fixture successfully created");
    done();
  });

  test("should view a single fixture", async (done) => {
    const res: any = await makeRequest
      .get(`/api/teams/${fixtureId}`)
      .set("authorization", `Bearer ${adminToken}`);

    expect((res as any).status).toBe(200);

    done();
  });

  test("should return 400 if fixture not found", async (done) => {
    const res: any = await makeRequest
      .get(`/api/fixtures/12344`)
      .set("authorization", `Bearer ${adminToken}`);

    expect((res as any).status).toBe(400);
    expect((res as any).body.message).toBe("Fixture not found");

    done();
  });

  test("should generate link for a particular fixture", async (done) => {
    const res: any = await makeRequest
      .get(`/api/fixtures/${fixtureId}/generate-link`)
      .set("authorization", `Bearer ${adminToken}`);

    expect((res as any).status).toBe(200);
    expect((res as any).body.message).toBe(
      "Successfully generated a unique link for the fixture fixture"
    );
    done();
  });

  test("should return 400 if fixture not found", async (done) => {
    const res: any = await makeRequest
      .put(`/api/fixtures/12344`)
      .set("authorization", `Bearer ${adminToken}`);

    expect((res as any).status).toBe(400);
    expect((res as any).body.message).toBe("Fixture not found");

    done();
  });

  test("should edit a particular team", async (done) => {
    const res: any = await makeRequest
      .put(`/api/fixtures/${fixtureId}`)
      .send({
        homeTeam: [{ name: "Chelsea" }, { score: 0 }],
        awayTeam: [{ name: "Chelsea" }, { score: 1 }],
        details: [
          { matchTime: "2019-11-26T16:24:32.674+00:00" },
          { stadium: "Old Trafford is bae" },
        ],
      })
      .set("authorization", `Bearer ${adminToken}`);

    expect((res as any).status).toBe(200);
    expect((res as any).body.message).toBe("Successfully  updated the Fixture");
    done();
  });

  test("should delete a particular fixture", async (done) => {
    const res: any = await makeRequest
      .delete(`/api/fixtures/${fixtureId}`)
      .set("authorization", `Bearer ${adminToken}`);

    expect((res as any).status).toBe(200);
    expect((res as any).body.message).toBe("Successfully deleted the team");
    done();
  });

  test("should return 400 when deleting a particular fixture that does not exist ", async (done) => {
    const res: any = await makeRequest
      .delete(`/api/fixtures/734029`)
      .set("authorization", `Bearer ${adminToken}`);

    expect((res as any).status).toBe(400);
    expect((res as any).body.message).toBe("Fixture not found");
    done();
  });

  test("should search for a particular team by query", async (done) => {
    const res: any = await makeRequest.get(`/api/fixtures/search?q=manchester`);

    expect((res as any).status).toBe(200);
    expect((res as any).body.message).toBe(
      "Successfully  fetched search results"
    );
    done();
  });
});
