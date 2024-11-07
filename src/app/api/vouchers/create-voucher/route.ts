import dbConnect from "@/lib/dbConnect";
import { ApiError } from "@/utils/ApiError";
import { ApiResponse } from "@/utils/ApiResponse";
import { NextResponse } from "next/server";
import { Voucher } from "@/models/voucher.model";

export async function POST(req: Request) {
  await dbConnect();

  try {
    const {
      voucherCode,
      voucherType,
      voucherAmount,
      voucherExpiryDate,
      voucherStatus,
    } = await req.json();
    console.log(
      "Received voucher data:",
      voucherCode,
      voucherType,
      voucherAmount,
      voucherExpiryDate,
      voucherStatus
    );

    // Check if all required fields are provided
    if (
      !voucherCode ||
      !voucherAmount ||
      !voucherExpiryDate ||
      !voucherStatus
    ) {
    }

    // Check if the voucher code already exists
    const existingVoucher = await Voucher.findOne({ voucherCode });
    if (existingVoucher) {
      return ApiError("Voucher already exists", 400);
    }

    // Create the voucher
    const voucher = new Voucher({
      voucherCode,
      voucherType,
      voucherAmount,
      voucherExpiryDate,
      voucherStatus,
    });
    await voucher.save();

    return NextResponse.json(
      new ApiResponse(200, "Voucher created successfully", voucher)
    );
  } catch (error) {
    console.log("Error creating voucher:", error);
    return ApiError("Internal Server Error", 500,error);
  }
}
