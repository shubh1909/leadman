import mongoose,{Schema} from "mongoose";

export interface Voucher extends Document {
  voucherCode: string;
  voucherType: string;
  voucherAmount: number;
  voucherExpiryDate: Date;
  voucherStatus: string;
  createdAt: Date;
  updatedAt: Date;
}

const voucherSchema = new Schema<Voucher>(
  {
    voucherCode: {
      type: String,
      required: true,
    },
    voucherType: {
      type: String, 
      enum: ['percentage', 'fixed', 'shipping'],
    },
    voucherAmount: {
      type: Number,
      required: true,
    },
    voucherExpiryDate: {
      type: Date,
      required: true,
    },
    voucherStatus: {
      type: String,
      required: true,
      enum: ['active', 'inactive'],
  default: 'active'
    },
  },
  {
    timestamps: true,
  }
);

export const Voucher = mongoose.models.Voucher || mongoose.model<Voucher>("Voucher", voucherSchema);