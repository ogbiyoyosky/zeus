import { Schema, Document, model, Model } from "mongoose";
import * as bcrypt from "bcrypt-nodejs";
import * as uniqueValidator from "mongoose-unique-validator";
import * as passport from "passport";

const SALT_WORK_FACTOR = 10;

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  password: string;
  createdAt: Date;
  modifiedAt: Date;
}

var validateEmail = function (email) {
  var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
};

export let UserSchema: Schema = new Schema({
  firstName: {
    type: String,
    required: "First Name is required",
  },
  lastName: {
    type: String,
    required: "Last Name is required",
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    required: "Email address is required",
    validate: [validateEmail, "Please fill a valid email address"],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please fill a valid email address",
    ],
  },
  password: {
    type: String,
    required: "Please enter a password",
    min: "Password should be at least 6 characters",
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  modifiedAt: {
    type: Date,
    default: new Date(),
  },
});

UserSchema.plugin(uniqueValidator);

UserSchema.pre<IUser>("save", function (next) {
  let user = this;
  bcrypt.hash(user.password, SALT_WORK_FACTOR, (error, hash) => {
    if (error) {
      return next(error);
    } else {
      this.password = hash;
      next();
    }
  });
});

/**
 * UserShchemaDoc Interface
 * @public
 */

interface UserSchemaDoc extends IUser, Document {
  comparePassword(pw, cb);
}

/**
 * method to comparePassword.
 * @public
 */
export const passwordMethod = (UserSchema.methods = {
  comparePassword: function (pw, cb) {
    bcrypt.compare(pw, this.password, function (err, isMatch) {
      if (err) {
        return cb(err);
      }
      cb(null, isMatch);
    });
  },
});

const UserModel: Model<UserSchemaDoc> = model<UserSchemaDoc>(
  "User",
  UserSchema
);
export default UserModel;
