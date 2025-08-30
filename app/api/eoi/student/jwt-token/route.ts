import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { generateStudentId } from "@/utils/models/generateStudentId";
import { connectDB } from "@/utils/config/dbConfig";

connectDB().catch(console.error);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { region, district, name, parentContact } = body;

    if (!region || !district || !name || !parentContact) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const studentId = await generateStudentId(region, district);

    const token = jwt.sign(
      { studentId, name, parentContact },
       process.env.JWT_SECRET || "JWT_SECRET=0KnH01T-R0ahuJPbGEa_1Xulge6fFMWpp9qhtaaKtB_UimeC8rQxHql_gEjjx4kJ",
      { expiresIn: "30m" }
    );

    return NextResponse.json({ studentId, token });
  } catch (err) {
    console.error("Init student error:", err);
    return NextResponse.json(
      { error: "Failed to init student" },
      { status: 500 }
    );
  }
}
