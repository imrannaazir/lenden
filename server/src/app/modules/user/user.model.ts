import { Schema, model } from 'mongoose';
import { TUser, TUserName } from './user.interface';
import { UserRole, UserStatus } from './user.constant';
import { hashPin } from '../auth/auth.utils';

const userNameSchema = new Schema<TUserName>(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
  },
  {
    _id: false,
  },
);
const userSchema = new Schema<TUser>(
  {
    name: userNameSchema,
    email: {
      type: String,
      required: true,
      unique: true,
    },
    mobileNumber: {
      type: String,
      required: true,
      unique: true,
    },
    nidNumber: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      enum: UserRole,
      required: true,
    },
    pin: {
      type: String,
      required: true,
      select: 0,
    },
    status: {
      type: String,
      enum: UserStatus,
      required: true,
    },
    balance: {
      type: Number,
      required: true,
    },
    token: {
      type: String,
      select: 0,
    },
  },
  {
    timestamps: true,
  },
);

// bcrypt the pin
userSchema.pre('save', async function (next) {
  this.pin = (await hashPin(this.pin)) as string;
  next();
});

// discontinue pin
userSchema.post('save', async function (doc, next) {
  doc.set('pin', undefined);
  doc.set('token', undefined);
  next();
});

const User = model<TUser>('user', userSchema);
export default User;
