import mongoose, { Schema } from "mongoose";

export interface review extends Document {
  review: string;
  createdAt: Date;
  updatedAt: Date;
}
const reviewSchema = new Schema<review>(
  {
    review: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const review =
  mongoose.models.review || mongoose.model<review>("review", reviewSchema);
