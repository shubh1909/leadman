import dbConnect from "@/lib/dbConnect";
import { ApiError } from "@/utils/ApiError";
import { ApiResponse } from "@/utils/ApiResponse";
import { NextResponse } from "next/server";
import { Voucher } from "@/models/voucher.model";
import { Lead } from "@/models/lead.model";

// Attach a specific voucher to a lead steps
// connect db
// get voucher code from req body
// get lead from req body
// get voucher from db
// check if voucher is active
// check if voucher is expired
// attach voucher
// attach the lead id to the voucher's attachedTo array
// return lead

export async function POST(req: Request) {
  await dbConnect();

  try {
    const { voucherCode, leadId } = await req.json();

    if (!voucherCode || !leadId) {
      return ApiError("Invalid request data", 400);
    }

    // get lead from db
    const lead = await Lead.findById(leadId);
    if (!lead) {
      return ApiError("Lead not found", 404);
    }

    // get voucher from db
    const voucher = await Voucher.findOne({ voucherCode });
    if (!voucher) {
      return ApiError("Voucher not found", 404);
    }

    // check if voucher is active
    if (voucher.voucherStatus !== "active") {
      return ApiError("Voucher is inactive", 400);
    }

    // check if voucher is expired
    if (voucher.voucherExpiryDate < new Date()) {
      return ApiError("Voucher is expired", 400);
    }

    // attach voucher
    lead.vouchers.push(voucher._id);

    // attach the lead id to the voucher's attachedTo array
    voucher.attachedTo.push(lead._id);

    await voucher.save();
    await lead.save();

    return NextResponse.json(
      new ApiResponse(200, lead, "Voucher attached successfully")
    );
  } catch (error) {
    console.log(error);
    return ApiError("Internal Server Error", 500, error);
  }
}
