import dbConnect from "@/lib/dbConnect";
import { ApiError } from "@/utils/ApiError";
import { ApiResponse } from "@/utils/ApiResponse";
import { NextResponse } from "next/server";
import { Review } from "@/models/review.model";

export async function GET(req: Request) {
  await dbConnect();

  try {
    //get all reviews from the database
    const reviews = await Review.find({});
    if (!reviews || reviews.length === 0) {
      return ApiError("No reviews found", 404);
    }

    return NextResponse.json(
      {
        data: reviews,
        message: "Successfully fetched reviews",
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return ApiError("Failed to fetch reviews", 500, error);
  }
}
