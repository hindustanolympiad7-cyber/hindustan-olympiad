import mongoose, { Document, Schema } from "mongoose"

export interface IActivityLog extends Document {
    schoolId: string,
    studentId: string,
    userId: string
    action: string
    description: string
}

const activityLogSchema = new Schema<IActivityLog>(
    {
        schoolId: { type: String },
        studentId: { type: String },
        userId: { type: String },
        action: { type: String },
        description: { type: String },
    },
    {
        timestamps: { createdAt: true, updatedAt: false },
    }
)

export const ActivityLog =
    mongoose.models.ActivityLog || mongoose.model<IActivityLog>("ActivityLog", activityLogSchema)
