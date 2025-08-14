import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/utils/config/dbConfig";
import { EoiSchool } from "@/utils/models/eoischool";

connectDB().catch(console.error);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log("Incoming body:", body); // <== log this

    const {
      schoolName,
      schoolCoordinatorContact,
      schoolAddress,
      district,
    } = body;

    // Validate required fields
    if (!schoolName || !schoolCoordinatorContact || !schoolAddress || !district) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    if (!/^\d{10}$/.test(schoolCoordinatorContact)) {
      return NextResponse.json(
        { error: "Invalid contact number" },
        { status: 400 }
      );
    }

    // ✅ Log this to check what you're saving
    console.log("Creating school with data:", {
      schoolName,
      schoolCoordinatorContact,
      schoolAddress,
      district,
    });

    const result = await EoiSchool.create({
      schoolName,
      schoolCoordinatorContact,
      schoolAddress,
      district,
    });

    return NextResponse.json(
      {
        message: "School registered successfully",
        school: result,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error registering school:", error.message, error.stack); // <== Better error logging
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

