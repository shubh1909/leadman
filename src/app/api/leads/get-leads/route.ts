import { Lead } from "@/models/lead.model";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { ApiError } from "@/utils/ApiError";
import { ApiResponse } from "@/utils/ApiResponse";
import { error } from "console";

export async function GET(req: Request) {
  await dbConnect();

  try {
    //  Fetch all the leads from the database
    const leads = await Lead.find(
      {},
      {
        userName: 1,
        phoneNumber: 1,
        lastVisited: 1,
        visitedCount: 1,
        vouchers: 1,
        reviews: 1,
      }
    );

    if (!leads || leads.length === 0) {
      return ApiError("No leads found", 404, error);
    }

    return NextResponse.json(
      {
        data: leads,
        message: "Successfully fetched leads",
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching leads:", error);
    return ApiError("Failed to fetch leads", 500, error);
  }
}
