import mongoose, { Schema } from "mongoose";

export interface Lead extends Document {
  userName: string;
  phoneNumber: string;
  lastVisited: Date;
  visitedCount: number;
  vouchers: [];
  reviews: [];
  createdAt: Date;
  updatedAt: Date;
}

const leadSchema = new Schema<Lead>(
  {
    userName: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 100,
    },
    phoneNumber: {
      type: String,
      required: true,
      match: /^[0-9]{10}$/, // Add regex validation for phone numbers
      unique: true, // Ensure unique phone numbers
    },
    lastVisited: {
      type: Date,
      default: Date.now,
      required: true,
    },
    visitedCount: {
      type: Number,
      default: 0,
      required: true,
    },
    vouchers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Voucher",
      },
    ],
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Lead =
  mongoose.models.Lead || mongoose.model<Lead>("Lead", leadSchema);
