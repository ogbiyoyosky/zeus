import request from "supertest";
import app from "../app";
const makeRequest = request(app);

import UserModel from "../models/User";
//import FixtureModel from "../models/Fixture";

let id;
let adminToken;
let userToken;
let InvalidToken;
let invalidRefreshToken = "nfjfnkrfmfkmkmfkmffmmfmmf";
let refreshToken;

export default () => {
  describe("User  Mangement and Authentication", () => {
    test("should register a user", async (done) => {
      const res: any = await makeRequest.post("/api/auth/register").send({
        firstName: "emmanuel",
        lastName: "ogbiyoyo",
        email: "user@gmail.com",
        password: "password",
      });
      expect((res as any).status).toBe(201);
      done();
    });

    test("should return 400 when the user already exist", async (done) => {
      const res: any = await makeRequest.post("/api/auth/register").send({
        firstName: "emmanuel",
        lastName: "ogbiyoyo",
        email: "user@gmail.com",
        password: "password",
      });
      expect((res as any).status).toBe(409);
      expect((res as any).body.message).toBe("Account already exist");
      expect((res as any).body.status_code).toBe(409);
      done();
    });

    test("should register a admin", async (done) => {
      const res: any = await makeRequest.post("/api/auth/admin/register").send({
        firstName: "emmanuel",
        lastName: "ogbiyoyo",
        email: "freeman@gmail.com",
        password: "password",
      });
      expect((res as any).status).toBe(201);
      expect((res as any).body.message).toBe("Account successfully created");
      done();
    });

    test("should return 400 when the admin already exist", async (done) => {
      const res: any = await makeRequest.post("/api/auth/admin/register").send({
        firstName: "emmanuel",
        lastName: "ogbiyoyo",
        email: "freeman@gmail.com",
        password: "password",
      });
      expect((res as any).status).toBe(409);
      expect((res as any).body.message).toBe("Account already exist");
      done();
    });

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

    test("should return 400 when account does not exist during authenticate a user", async (done) => {
      const res: any = await makeRequest.post("/api/auth/signin").send({
        email: "freeman@gmail111.com",
        password: "password",
      });
      expect((res as any).status).toBe(400);
      expect((res as any).body.message).toBe("Account not found");
      done();
    });

    test("should return 400 when account does not exist during authenticate a user", async (done) => {
      const res: any = await makeRequest.post("/api/auth/signin").send({
        email: "freeman@gmail.com",
        password: "password23",
      });
      expect((res as any).status).toBe(400);
      expect((res as any).body.message).toBe("Invalid email or password");
      done();
    });

    test("should return 401 when token not passed to generate refresh token", async (done) => {
      const res: any = await makeRequest
        .post("/api/auth/refresh-token")
        .send({});
      expect((res as any).status).toBe(401);
      expect((res as any).body.message).toBe("Provid a valid token");
      done();
    });

    test("should return 401 when passed an invalid token to generate refresh token", async (done) => {
      const res: any = await makeRequest
        .post("/api/auth/refresh-token")
        .send({ refreshToken: invalidRefreshToken });

      expect((res as any).status).toBe(401);

      done();
    });

    test("should return 200 when passed an valid token to generate refresh token", async (done) => {
      const res: any = await makeRequest
        .post("/api/auth/refresh-token")
        .send({ token: refreshToken });

      expect((res as any).status).toBe(200);

      expect((res as any).body.message).toBe(
        "Successfully generated new credentials"
      );
      done();
    });
  });
};
