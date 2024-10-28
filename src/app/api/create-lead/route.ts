import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { Lead } from "@/models/lead.model";
import { ApiError } from "@/utils/ApiError";
import { auth, currentUser } from "@clerk/nextjs/server";
import { ApiResponse } from "@/utils/ApiResponse";

export async function POST(req: Request) {
  await dbConnect();
  try {
    //get current user
    // const { userId, redirectToSignIn } = await auth();
    // if (!userId) return redirectToSignIn();

    const { userName, phoneNumber } = await req.json();

    if (!userName || !phoneNumber) {
      throw new ApiError(400, [], "Invalid request data");
    }

     

    // Check if the lead already exists
    const existingLead = await Lead.findOne({ phoneNumber });
    if (existingLead) {
      throw new ApiError(400, [], "Lead already exists");
    }

    // Create a new lead
    const lead = new Lead({
      userName,
      phoneNumber,
      lastVisited: new Date(),
      visitedCount: 1,
    });
    await lead.save();

    return NextResponse.json(
      new ApiResponse(200, lead, "Lead created successfully")
    );
  } catch (error) {
    console.error("Error creating lead:", error);
    throw new ApiError(500, [error], "Internal Server Error");
  }
}
