import request from "supertest";
import app from "../app";
const makeRequest = request(app);
import TeamModel from "../models/Team";

let id;
let adminToken;
let userToken;
let InvalidToken;
let invalidRefreshToken = "nfjfnkrfmfkmkmfkmffmmfmmf";
let refreshToken;
let teamId;

beforeAll(async () => {
  await TeamModel.deleteMany({});
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

  test("should create a team", async (done) => {
    const res: any = await makeRequest
      .post("/api/teams")
      .send({
        teamName: "Tottenham Hotspur",
        members: [
          { name: "Dele Ali", position: "Left Winger" },
          { name: "Son", position: "Attacking Midfield" },
        ],
        description: "Totteham Footbal; Club",
        location: "England",
      })
      .set("authorization", `Bearer ${adminToken}`);

    teamId = res.body.results["_id"];

    expect((res as any).status).toBe(201);
    expect((res as any).body.message).toBe("Team successfully created");
    done();
  });

  test("should return 409 when tryng to create the same team", async (done) => {
    const res: any = await makeRequest
      .post("/api/teams")
      .send({
        teamName: "Tottenham Hotspur",
        members: [
          { name: "Dele Ali", position: "Left Winger" },
          { name: "Son", position: "Attacking Midfield" },
        ],
        description: "Totteham Footbal; Club",
        location: "England",
      })
      .set("authorization", `Bearer ${adminToken}`);
    expect((res as any).status).toBe(400);
    // expect((res as any).body.status).toBe("conflict");
    done();
  });
});

test("should view a single team", async (done) => {
  const res: any = await makeRequest
    .get(`/api/teams/${teamId}`)
    .set("authorization", `Bearer ${adminToken}`);

  expect((res as any).status).toBe(200);

  done();
});

test("should return 400 if team not found", async (done) => {
  const res: any = await makeRequest
    .get(`/api/teams/12344`)
    .set("authorization", `Bearer ${adminToken}`);

  expect((res as any).status).toBe(400);
  expect((res as any).body.message).toBe("Team not found");

  done();
});

test("should view all team", async (done) => {
  const res: any = await makeRequest
    .get(`/api/teams/`)
    .set("authorization", `Bearer ${adminToken}`);

  expect((res as any).status).toBe(200);
  expect((res as any).body.message).toBe("Successfully  fetched all teams");
  done();
});

test("should edit a particular team", async (done) => {
  const res: any = await makeRequest
    .put(`/api/teams/${teamId}`)
    .send({
      teamName: "Tottenham Hotspur",
      members: [
        { name: "Dele Ali", position: "Left Winger" },
        { name: "Son", position: "Attacking Midfield" },
      ],
      description: "The best englis team",
      location: "England",
    })
    .set("authorization", `Bearer ${adminToken}`);

  expect((res as any).status).toBe(200);
  expect((res as any).body.message).toBe("Successfully updated the team");
  done();
});

test("should delete a particular team", async (done) => {
  const res: any = await makeRequest
    .delete(`/api/teams/${teamId}`)
    .set("authorization", `Bearer ${adminToken}`);

  expect((res as any).status).toBe(200);
  expect((res as any).body.message).toBe("Successfully deleted the team");
  done();
});

test("should delete a particular team", async (done) => {
  const res: any = await makeRequest
    .delete(`/api/teams/$734029`)
    .set("authorization", `Bearer ${adminToken}`);

  expect((res as any).status).toBe(400);
  expect((res as any).body.message).toBe("Team not found");
  done();
});

test("should search for a particular team by query", async (done) => {
  const res: any = await makeRequest.get(`/api/teams/search?q=manchester`);

  expect((res as any).status).toBe(200);
  expect((res as any).body.message).toBe(
    "Successfully  fetched search results"
  );
  done();
});
