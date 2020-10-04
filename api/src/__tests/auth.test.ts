import request from "supertest";
import app from "../app";
const makeRequest = request(app);
import UserModel from "../models/User";

beforeAll(async () => {
  await UserModel.deleteMany({});
});
describe("User Signup", () => {
  test("should register a user", async (done) => {
    const res: any = await makeRequest.post("/api/auth/register").send({
      firstName: "emmanuel",
      lastName: "ogbiyoyo",
      email: "ggjgjjg@gmail.com",
      password: "password",
    });

    console.log(res);

    expect((res as any).status).toBe(201);

    done();
  });

  test("should register a user", async (done) => {
    const res: any = await makeRequest.post("/api/auth/register").send({
      firstName: "emmanuel",
      lastName: "ogbiyoyo",
      email: "ggjgjjg@gmail.com",
      password: "password",
    });

    console.log(res);

    expect((res as any).status).toBe(201);

    done();
  });
});
