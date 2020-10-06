import auth from "./auth.spartial";
import team from "./team.spartial";
import fixture from "./fixture.spartial";
import UserModel from "../models/User";
import FixtureModel from "../models/Fixture";
import TeamModel from "../models/Team";

(async function () {
  console.log("clearingusers table");
  await UserModel.deleteMany({});
  await FixtureModel.deleteMany({});
  await TeamModel.deleteMany({});
})();

console.log(process.env);

auth();
team();
fixture();
