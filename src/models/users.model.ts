import { model, Schema, Document } from 'mongoose';
import { User } from '@interfaces/users.interface';

const userSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    displayName: {
      type: String,
      required: true,
    },
    profileLogo:{
      type:String,
      require:false
    },
    phone: {
      type: String,
      required: false,
    },
    password: {
      type: String,
      required: true,
    },
    userRole: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
    },
    updatedA: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

const userModel = model<User & Document>('User', userSchema);

export default userModel;
