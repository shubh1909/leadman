import dbConnect from "@/lib/dbConnect";
import { ApiError } from "@/utils/ApiError";
import { ApiResponse } from "@/utils/ApiResponse";
import { NextResponse } from "next/server";
import { Review } from "@/models/review.model";
import { todo } from "node:test";

// TODO: Add validation for review and user pipline using clerk 
export async function POST(req: Request) {
  await dbConnect();
  try {
    const { review } = await req.json();

    if (!review) {
      return ApiError("Review is required", 400);
    }

    // Create the review
    const newReview = new Review({
      review,
    });
    await newReview.save();

    return NextResponse.json(
      new ApiResponse(201, "Review created successfully", newReview)
    );
  } catch (error) {
    console.error("Error creating review:", error);
    return ApiError("Internal Server Error", 500 , error);
  }
}
