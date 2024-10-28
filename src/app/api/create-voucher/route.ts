import dbConnect from "@/lib/dbConnect";
import { ApiError } from "@/utils/ApiError";
import { ApiResponse } from "@/utils/ApiResponse";
import { NextResponse } from "next/server";
import { Voucher } from "@/models/voucher.model";

export async function POST(req: Request) {
  await dbConnect();

  try {
    const { voucherCode, voucherType , voucherAmount ,voucherExpiryDate, voucherStatus} = await req.json();
    console.log("Received voucher data:", voucherCode, voucherType, voucherAmount, voucherExpiryDate, voucherStatus);

    // Check if all required fields are provided
    if (!voucherCode || !voucherAmount || !voucherExpiryDate || !voucherStatus) {
      throw new ApiError(400, [], "Missing required fields");
    }

    // Check if the voucher code already exists
    const existingVoucher = await Voucher.findOne({ voucherCode });
    if (existingVoucher) {
      throw new ApiError(400, [], "Voucher code already exists");
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
    throw new ApiError(500, [error], "Internal Server Error");
  }
}