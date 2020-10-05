import { Schema, Document, model, Model } from "mongoose";
import * as bcrypt from "bcrypt-nodejs";

const SALT_WORK_FACTOR = 10;

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  password: string;
  createdAt: Date;
  modifiedAt: Date;
  deletedAt: Date;
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
  role: {
    type: String,
    required: true,
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

UserSchema.pre<IUser>("save", function (next) {
  var user = this;

  if (!user.isModified("password")) return next();

  bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, null, function (err, hash) {
      if (err) return next(err);

      user.password = hash;
      next();
    });
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

UserSchema.methods.toJSON = function () {
  var obj = this.toObject();
  delete obj.password;
  return obj;
};

const UserModel: Model<UserSchemaDoc> = model<UserSchemaDoc>(
  "User",
  UserSchema
);
export default UserModel;
