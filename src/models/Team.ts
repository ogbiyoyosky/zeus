import mongoose, { Schema, Document, model, Model } from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

export interface ITeam extends Document {
  teamName: String;
  members: [
    {
      name: String;
      position: String;
    }
  ];
  location: String;
  description: String;
  createdAt: Date;
  modifiedAt: Date;
  deletedAt: Date;
}

export let TeamSchema: Schema = new Schema({
  teamName: {
    type: String,
    required: "Team Name is required",
    unique: true,
  },
  location: {
    type: String,
    required: "Team Name is required",
  },
  members: {
    name: {
      type: String,
      lowercase: true,
      required: true,
    },
    position: {
      type: String,
      required: true,
    },
    type: Array,
  },
  description: String,
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
});

TeamSchema.plugin(uniqueValidator);

TeamSchema.index(
  {
    teamName: "text",
    location: "text",
    "members.name": "text",
    "members.position": "text",
    description: "text",
    status: "text",
  },
  {
    name: "searchIndex",
  }
);

interface TeamSchemaDoc extends ITeam, Document {}

const TeamModel: Model<TeamSchemaDoc> = model<TeamSchemaDoc>(
  "Team",
  TeamSchema
);

TeamModel.on("index", function (err) {
  if (err) {
    console.log("ERROR", err);
  }
});

// TeamModel.collection.dropIndexes((err, r) => {
//   console.log(r);
// });

TeamModel.ensureIndexes();
export default TeamModel;
