import { Schema, Document, model, Model } from "mongoose";

export interface ITeam extends Document {
  teamName: string;
  location: string;
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
    required: "location is required",
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
});

interface TeamSchemaDoc extends ITeam, Document {}

const TeamModel: Model<TeamSchemaDoc> = model<TeamSchemaDoc>(
  "Team",
  TeamSchema
);
export default TeamModel;
