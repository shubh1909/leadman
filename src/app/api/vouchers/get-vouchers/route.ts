import dbConnect from "@/lib/dbConnect";
import { ApiError } from "@/utils/ApiError";
import { ApiResponse } from "@/utils/ApiResponse";
import { NextResponse } from "next/server";
import { Voucher } from "@/models/voucher.model";

export async function GET(req: Request) {
  await dbConnect();

  try {
    //get all vouchers from the database
    const vouchers = await Voucher.find({});

    if (!vouchers || vouchers.length === 0) {
      return ApiError("No vouchers found", 404);
    }

    return NextResponse.json(
      {
        data: vouchers,
        message: "Successfully fetched vouchers",
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching vouchers:", error);
    return ApiError("Failed to fetch vouchers", 500, error);
  }
}
