import { NextRequest, NextResponse } from "next/server";
import mongoose, { Document } from "mongoose";
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
    role: "finance" | "viewer" | "admin";
}

export async function GET(req: NextRequest): Promise<NextResponse> {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id"); // ID of the user making the request
    const schoolId = searchParams.get("schoolId");
    const studentId = searchParams.get("studentId");
    console.log("IDD ::", id, "SCHOLL ID :", schoolId, "STUDENT ID ::", studentId)

    if (!id) {
        return NextResponse.json({ error: "Missing 'id' parameter" }, { status: 400 });
    }

    try {
        const teamMember: ITeamMember | null = await TeamMember.findById(id).lean();

        if (!teamMember) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        let activityLogs;

        if (teamMember.role === "finance") {
            // Finance role can view more data based on studentId or schoolId
            if (studentId) {
                activityLogs = await ActivityLog.find({ studentId }).sort({ createdAt: -1 }).lean();
            } else if (schoolId) {
                activityLogs = await ActivityLog.find({ schoolId }).sort({ createdAt: -1 }).lean();
            } else {
                // Default: own logs
                activityLogs = await ActivityLog.find({ userId: id }).sort({ createdAt: -1 }).lean();
            }
        } else {
            // Other roles can only view their own logs
            activityLogs = await ActivityLog.find({ userId: id }).sort({ createdAt: -1 }).lean();
        }

        return NextResponse.json(activityLogs);
    } catch (error) {
        return NextResponse.json(
            {
                error: "Failed to fetch activity logs",
                details: (error as Error).message,
            },
            { status: 500 }
        );
    }
}
