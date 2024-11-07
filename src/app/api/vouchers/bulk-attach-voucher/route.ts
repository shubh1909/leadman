import dbConnect from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import { Lead } from "@/models/lead.model";
import { Voucher } from "@/models/voucher.model";
import { ApiError } from "@/utils/ApiError";
import { ApiResponse } from "@/utils/ApiResponse";

// Attach a specific voucher to all the given leads
// connect db
// get voucher code from req body
// get leads from req body
// get voucher from db
// check if voucher is active
// check if voucher is expired
// attach voucher to all leads
// update all leads with the voucher code
// update voucher attachedTo array with the lead id
// return the updated leads._id

export async function POST(req: Request) {
  await dbConnect();

  try {
    const { voucherCode } = await req.json();
    if (!voucherCode) {
      return ApiError("Invalid request data", 400);
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

    // update all leads with the voucher code
    const leads = await Lead.updateMany(
      { vouchers: { $nin: [voucher._id] } },
      { $push: { vouchers: voucher._id } }
    );

    // Get all leads that just received the voucher
    const updatedLeads = await Lead.find({ vouchers: voucher._id });

    //check  if leads is empty
    if (updatedLeads.length === 0) {
      return ApiError("No leads found with this voucher", 404);
    }

    // Update the voucher's attachedTo array with the lead IDs
    await Voucher.findByIdAndUpdate(voucher._id, {
      $addToSet: {
        attachedTo: updatedLeads.map((lead) => lead._id),
      },
    });

    // return the updated leads._id
    return NextResponse.json(
      new ApiResponse(
        200,
        { updatedLeadsCount: updatedLeads.length },
        "Voucher attached successfully"
      )
    );
  } catch (error) {
    console.log(error);
    return ApiError("Something went wrong", 500,error);
  }
}
