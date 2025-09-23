import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/utils/config/dbConfig";   // 👈 import connection
import { School } from "@/utils/models/School";
import { ActivityLog } from "@/utils/models/ActivityLogs";
import { TeamMember } from "@/utils/models/team-members";

interface ITeamMember extends Document {
  _id: mongoose.Types.ObjectId;
  name?: string;
  phone: string;
  email?: string;
  region?: string;
  OTP?: string;
  lastOTPSent?: Date;
  role: "finance" | "admin";
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    await connectDB();  // 👈 ensure DB connection before any query
    const schools = await School.find({}).lean();

    let createdCount = 0;
    let skippedCount = 0;

    let validAddedByCount = 0;   // ✅ addedBy exists and valid TeamMember found
    let missingUserCount = 0;    // ❌ addedBy exists but no TeamMember found
    let noAddedByCount = 0;      // 🟡 addedBy field not present

    const missingUsers: string[] = [];

    for (const school of schools) {
      const exists = await ActivityLog.findOne({
        schoolId: school.schoolId,
        action: "SCHOOL_ADD",
      });

      if (!exists) {
        let teamMember: ITeamMember | null = null;

        if (school.addedBy) {
          teamMember = await TeamMember.findById(school.addedBy).lean();

          if (teamMember) {
            validAddedByCount++;
          } else {
            missingUserCount++;
            missingUsers.push(`${school.schoolId} → ${school.addedBy}`);
          }
        } else {
          noAddedByCount++;
        }

        await ActivityLog.create({
          schoolId: school.schoolId,
          userId: school.addedBy || new mongoose.Types.ObjectId("000000000000000000000000"),
          action: "SCHOOL_ADD",
          description: `New school ${school.schoolId} added with name ${school.schoolName} by ${teamMember?.name || "Unknown"}`,
        });

        createdCount++;
      } else {
        skippedCount++;
      }
    }

    return NextResponse.json({
      message: "Backfill complete",
      createdCount,
      skippedCount,
      stats: {
        validAddedByCount,
        missingUserCount,
        noAddedByCount,
      },
      missingUsers: missingUsers.slice(0, 50), // sirf first 50 show karenge debug ke liye
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error", error }, { status: 500 });
  }
}
