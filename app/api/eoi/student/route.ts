import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/utils/config/dbConfig";
import { EoiStudent } from "@/utils/models/eoistudent";

connectDB().catch(console.error);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("Incoming body:", body); // <== log this
    const {
      name,
      district,
      phoneNumber,
      schoolName,
      class: studentClass,
    } = body;

    // Validate required fields
    if (
      !name ||
      !district ||
      !phoneNumber ||
      !schoolName ||
      !studentClass
    ) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Validate phone number format
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phoneNumber)) {
      return NextResponse.json(
        { error: "Invalid student phone number" },
        { status: 400 }
      );
    }

    // Create a new student document
    const result = await EoiStudent.create({
      name,
      district,
      phoneNumber,
      schoolName,
      class: studentClass,
    });

    return NextResponse.json(
      {
        message: "Student registered successfully",
        student: result,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error registering student:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
