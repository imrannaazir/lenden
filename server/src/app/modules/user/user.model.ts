import { Schema, model } from 'mongoose';
import { TUser, TUserName } from './user.interface';
import { UserRole } from './user.constant';
import { hashPin } from '../auth/auth.utils';

const userNameSchema = new Schema<TUserName>({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
});
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
      type: Number,
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

const User = model<TUser>('user', userSchema);
export default User;
