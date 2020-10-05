const faker = require("faker");
const mongoose = require("mongoose");
const _ = require("lodash");
import UserModel from "../models/User";
import TeamModel from "../models/Team";
import FixtureModel from "../models/Fixture";

import dotenv from "dotenv";

dotenv.config();

const client = {
  connect: async () => {
    try {
      mongoose.connect(
        process.env.NODE_ENV == "test"
          ? process.env.TEST_MONGO_URI
          : process.env.MONGO_URI,
        {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          useCreateIndex: true,
        }
      );
      console.log("Connected to the database!!!");
    } catch (error) {
      throw error;
    }
  },
  disconnect: () => mongoose.disconnect(),
};

async function clear() {
  await FixtureModel.deleteMany({});
  await UserModel.deleteMany({});
  await TeamModel.deleteMany({});
}

function seedUser(randomSeed, numData) {
  faker.seed(randomSeed);
  return Promise.all(
    [...Array(numData)].map(async () => {
      await UserModel.create<any>([
        {
          firstName: faker.name.findName(),
          email: faker.internet.email(),
          lastName: faker.name.findName(),
          password: "123456",
          role: "ADMIN",
        },
      ]);
    })
  );
}

async function seedFixture() {
  await FixtureModel.create<any>([
    {
      homeTeam: [{ name: "Arsenal", score: 0 }],
      awayTeam: [{ name: "Chelsea", score: 0 }],
      status: "completed",
      details: [
        { date: "2019-11-25T16:24:32.674+00:00" },
        { stadium: "Craven Cottage" },
      ],
    },
    {
      homeTeam: [{ name: "Brighton and Hove Albion", score: 0 }],
      awayTeam: [{ name: "Aston Villa", score: 0 }],
      status: "pending",
      details: [
        { date: "2019-11-09T16:24:32.674+00:00" },
        { stadium: "Vitality Stadium" },
      ],
    },
    {
      homeTeam: [{ name: "Aston Villa", score: 0 }],
      awayTeam: [{ name: "AFC Bournemouth", score: 0 }],
      status: "completed",
      details: [
        { date: "2019-11-01T16:24:32.674+00:00" },
        { stadium: "King Power Stadium" },
      ],
    },
    {
      homeTeam: [{ name: "Arsenal", score: 0 }],
      awayTeam: [{ name: "AFC Bournemouth", score: 0 }],
      status: "pending",
      details: [
        { date: "2019-11-04T16:24:32.674+00:00" },
        { stadium: "Vicarage Road" },
      ],
    },
    {
      homeTeam: [{ name: "Aston Villa", score: 0 }],
      awayTeam: [{ name: "Chelsea", score: 0 }],
      status: "completed",
      details: [
        { date: "2019-11-26T16:24:32.674+00:00" },
        { stadium: "Craven Cottage" },
      ],
    },
  ]);
}

async function seedTeams() {
  await TeamModel.create<any>([
    {
      teamName: "Arsenal",
      location: "England",
      description: "Gunners",
      members: [
        { name: "Sead Kolasinac", position: "Defender" },
        { name: "Calum Chambers", position: "Defender" },
        { name: "Kieran Tierney", position: "Defender" },
        { name: "David Luiz", position: "Defender" },
        { name: "Tolaji Bola", position: "Defender" },
        { name: "Mesut Ozil", position: "Midfielder" },
        { name: "Lucas Torreira", position: "Midfielder" },
        { name: "Ainsley Maitland-Niles", position: "Midfielder" },
        { name: "Matteo Guendouzi", position: "Midfielder" },
        { name: "Granit Xhaka", position: "Midfielder" },
        { name: "Joe Willock", position: "Midfielder" },
        { name: "Emile Smith Rowe", position: "Midfielder" },
        { name: "Gabriel Martinelli", position: "Midfielder" },
        { name: "Dani Ceballos", position: "Midfielder" },
        { name: "Robbie Burton", position: "Midfielder" },
        { name: "Alexandre Locazatte", position: "Forward" },
        { name: "Pierre-Emerick Aubameyang", position: "Forward" },
        { name: "Reiss Nelson", position: "Forward" },
        { name: "Nicolas Pepe", position: "Forward" },
        { name: "Bukayo Saka", position: "Forward" },
        { name: "Folarin Balogun", position: "Forward" },
      ],
    },
    {
      teamName: "Aston Villa",
      location: "England",
      description: "Astons",
      members: [
        { name: "Orjan Nyland", position: "Gaol Keeper" },
        { name: "Jed Steer", position: "Gaol Keeper" },
        { name: "Lovre Kalinic", position: "Gaol Keeper" },
        { name: "Tom Heaton", position: "Defender" },
        { name: "Neil Taylor", position: "Defender" },
        { name: "James Chester", position: "Defender" },
        { name: "Ahmed El Mohamady", position: "Defender" },
        { name: "Frederic", position: "Defender" },
        { name: "Matt Targett", position: "Defender" },
        { name: "Kortney Hause", position: "Defender" },
        { name: "Tyrone Mings", position: "Defender" },
        { name: "Ezri Kansa Ngoyo", position: "Defender" },
        { name: "Bjorn Engels", position: "Defender" },
        { name: "John McGinn", position: "Midfielder" },
        { name: "Henri Lansbury", position: "Midfielder" },
        { name: "Jack Grealish", position: "Midfielder" },
        { name: "Conor Hourihane", position: "Midfielder" },
        { name: "Keinan Davis", position: "Midfielder" },
        { name: "Jota", position: "Midfielder" },
        { name: "Anwar El Ghazi", position: "Midfielder" },
        { name: "Trezeguet", position: "Midfielder" },
        { name: "Douglas Luiz", position: "Midfielder" },
        { name: "Marvelous Nakamba", position: "Midfielder" },
        { name: "Jacob Ramsey", position: "Midfielder" },
        { name: "Jonathan Kodija", position: "Forward" },
        { name: "Wesley", position: "Forward" },
        { name: "Cameron Archer", position: "Forward" },
      ],
    },
    {
      teamName: "AFC Bournemouth",
      location: "England",
      description: "Bournemouth city",
      members: [
        { name: "Artur Boruc", position: "Gaol Keeper" },
        { name: "Mark Travers", position: "Gaol Keeper" },
        { name: "Aaron Ramsdale", position: "Gaol Keeper" },
        { name: "William Dennis", position: "Gaol Keeper" },
        { name: "Simon Francis", position: "Defender" },
        { name: "Steve Cook", position: "Defender" },
        { name: "Nathan Ake", position: "Defender" },
        { name: "Charlie Daniels", position: "Defender" },
        { name: "Adam Smith", position: "Defender" },
        { name: "Diego Rico", position: "Defender" },
        { name: "Jack Simpson", position: "Defender" },
        { name: "Chris Mepham", position: "Defender" },
        { name: "Lloyd Kelly", position: "Defender" },
        { name: "Brad Smith", position: "Defender" },
        { name: "Jack Stacey", position: "Defender" },
        { name: "Jordan Zemura", position: "Midfielder" },
        { name: "Brennan Camp", position: "Defender" },
        { name: "Corey Jordan", position: "Defender" },
        { name: "Dan Gosling", position: "Midfielder" },
        { name: "Andrew Surman", position: "Midfielder" },
        { name: "David Brooks", position: "Midfielder" },
        { name: "Ryan Fraser", position: "Midfielder" },
        { name: "Matt Butcher", position: "Midfielder" },
        { name: "Mihai-Alexandru Dobre", position: "Midfielder" },
        { name: "Philip Billing", position: "Midfielder" },
        { name: "Harry Wilson", position: "Midfielder" },
        { name: "Gravin Kilkenny", position: "Midfielder" },
        { name: "Philip Billing", position: "Midfielder" },
        { name: "Callum Wilson", position: "Forward" },
        { name: "Joshua King", position: "Forward" },
        { name: "Dominic Solanke", position: "Forward" },
        { name: "Arnaut Danjuma", position: "Forward" },
      ],
    },
    {
      teamName: "Brighton & Hove Albion",
      location: "England",
      description: "Brighton",
      members: [
        { name: "David Button", position: "Gaol Keeper" },
        { name: "Robert Sánchez", position: "Gaol Keeper" },
        { name: "Mathew Ryan", position: "Gaol Keeper" },
        { name: "Jason Steele", position: "Gaol Keeper" },
        { name: "Leon Balogun", position: "Defender" },
        { name: "Bernardo", position: "Defender" },
        { name: "Gaëtan Bong", position: "Defender" },
        { name: "Bruno", position: "Defender" },
        { name: "Dan Burn", position: "Defender" },
        { name: "Shane Duffy", position: "Defender" },
        { name: "Lewis Dunk", position: "Defender" },
        { name: "Martín Montoya", position: "Defender" },
        { name: "Leo Østigård", position: "Defender" },
        { name: "Yves Bissouma", position: "Midfielder" },
        { name: "Will Collar", position: "Midfielder" },
        { name: "Pascal Groß", position: "Midfielder" },
        { name: "Biram Kayal", position: "Midfielder" },
        { name: "Anthony Knockaert", position: "Midfielder" },
        { name: "Solomon March", position: "Midfielder" },
        { name: "Jayson Molumby", position: "Midfielder" },
        { name: "Davy Pröpper", position: "Midfielder" },
        { name: "Max Sanders", position: "Midfielder" },
        { name: "Dale Stephens", position: "Midfielder" },
        { name: "Viktor Gyökeres", position: "Forward" },
        { name: "José Izquierdo", position: "Forward" },
        { name: "Alireza Jahanbakhsh", position: "Forward" },
        { name: "Jürgen Locadia", position: "Forward" },
        { name: "Glenn Murray", position: "Forward" },
        { name: "Ben Roberts", position: "Coach" },
        { name: "Paul Trollope", position: "Assistance Manager" },
      ],
    },
  ]);
}

function runProgram() {
  return client
    .connect()
    .then(() => clear())
    .then(() => seedUser(12379880900, 5))
    .then(() => seedTeams())
    .then(() => seedFixture())
    .then(() => client.disconnect());
}
runProgram().then(
  () => {
    console.log("Completed");
  },
  (err) => {
    console.log(err);
  }
);
