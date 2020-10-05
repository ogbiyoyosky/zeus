import mongoose, { Schema, Document, model, Model } from "mongoose";

export interface IFixture extends Document {
  homeTeam: [Object];
  awayTeam: [Object];
  generatedLink: String;
  time: Date;
  status: String;
  details: Object;
  createdAt: Date;
  modifiedAt: Date;
  deletedAt: Date;
}

const team = {
  ref: "Team",
  type: Array,
  name: {
    type: String,
    enum: [
      "AFC Bournemouth",
      "Arsenal",
      "Aston Villa",
      "Brighton & Hove Albion",
      "Burnley",
      "Chelsea",
      "Crystal Palace",
      "Everton",
      "Leicester City",
      "Liverpool",
      "Manchester City",
      "Manchester United",
      "Newcastle United",
      "Norwich City",
      "Sheffield United",
      "Southampton",
      "Tottenham Hotspur",
      "Watford",
      "West Ham United",
      "Wolverhampton Wanderers",
    ],
  },
  score: { type: Number, default: 0 },
};

export let FixtureSchema: Schema = new Schema(
  {
    homeTeam: team,
    awayTeam: team,
    details: {
      type: Array,
      matchTime: {
        type: Date,
        default: new Date(),
      },
      staduim: {
        type: String,
        enum: [
          "Vitality Stadium",
          "The Amex",
          "Turf Moor",
          "Cardiff City Stadium",
          "John Smith's Stadium",
          "King Power Stadium",
          "Goodison Park",
          "Anfield",
          "Emirates Stadium",
          "Stamford Bridge",
          "Selhurst Park",
          "Craven Cottage",
          "Wembley Stadium",
          "London Stadium",
          "Etihad Stadium",
          "Old Trafford",
          "St James Park",
          "St Mary's Stadium",
          "Vicarage Road",
          "Molineux Stadium",
        ],
      },
    },
    status: { type: String, default: "pending" },
    generatedLink: {
      type: String,
      default: null,
    },
    createdAt: {
      type: Date,
      default: new Date(),
    },
    modifiedAt: {
      type: Date,
      default: new Date(),
    },

    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    emitIndexErrors: true,
    autoIndex: true,
  }
);

FixtureSchema.index(
  {
    "homeTeam.name": "text",
    "awayTeam.name": "text",
    generatedLink: "text",
    "details.matchTime": "text",
    status: "text",
  },
  {
    name: "searchIndex",
  }
);

interface FixtureSchemaDoc extends IFixture, Document {}

const FixtureModel: Model<FixtureSchemaDoc> = model<FixtureSchemaDoc>(
  "Fixture",
  FixtureSchema
);

FixtureModel.on("index", function (err) {
  if (err) {
    console.log("ERROR", err);
  }
});

FixtureModel.ensureIndexes();

export default FixtureModel;
