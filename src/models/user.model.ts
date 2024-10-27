import mongoose,{Schema} from "mongoose";

export interface User extends Document {
  fullName: string;
  phoneNumber: number,
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<User>(
  {
    fullName: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.models.User || mongoose.model<User>("User", userSchema);