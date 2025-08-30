import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
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
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id"); // logged-in user ID
  try {
    let createdCount = 0;
    let skippedCount = 0;

    // ---- Step 1: Backfill for Schools ----
    const schools = await School.find({}).lean();

    // logged-in team member fetch
    let teamMember: ITeamMember | null = id ? await TeamMember.findById(id).lean() : null;
    console.log("✅ Logged-in TeamMember:", teamMember ? teamMember.name : "Unknown");

    for (const school of schools) {
      // check agar already activity log bana hua hai
      const exists = await ActivityLog.findOne({
        schoolId: school.schoolId,
        action: "SCHOOL_ADD",
      });

      if (!exists) {
        // yaha directly school.createdBy ya koi user reference use karna chahiye
        // agar sirf logged-in user ke naam chahiye to wahi use karo
        await ActivityLog.create({
          schoolId: school.schoolId,
          userId: teamMember?._id, // ✅ sirf ObjectId store karo
          action: "SCHOOL_ADD",
          description: `New school ${school.schoolId} added with name ${school.schoolName} by ${teamMember ? teamMember.name : "Unknown"}`,
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
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error", error }, { status: 500 });
  }
}
