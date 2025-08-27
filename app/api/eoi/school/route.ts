import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/utils/config/dbConfig";
import { EoiSchool } from "@/utils/models/eoischool";

connectDB().catch(console.error);

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const query = searchParams.get("query") || "";
    const region = searchParams.get("region") || "";
    const district = searchParams.get("district") || "";

    const filter: any = {};

    // 🔍 Search fields for school
    if (query) {
      filter.$or = [
        { schoolName: { $regex: query, $options: "i" } },
        { schoolCoordinatorContact: { $regex: query, $options: "i" } },
        { schoolCoordinatorEmail: { $regex: query, $options: "i" } },
        { schoolAddress: { $regex: query, $options: "i" } },
      ];
    }

    if (region) filter.region = region;
    if (district) filter.district = district;

    const total = await EoiSchool.countDocuments(filter);
    const schools = await EoiSchool.find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    return NextResponse.json({
      schools,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Error fetching schools:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

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

