import mongoose from "mongoose";

export interface IEoiStudent extends mongoose.Document {
    studentId: string; // नया field
    name: string;
    district: string;
    // phoneNumber: string;
    schoolName: string;
    class: string;
    section: string;
    gender: string;
    stream: string;
    parentName: string;
    parentContact: string;
    schoolBranch: string;
    schoolAddress: string;
    region: string;
}

const eoiStudentSchema = new mongoose.Schema(
    {
        studentId: { type: String, unique: true }, // auto generate होगा
        name: { type: String, required: true },
        district: { type: String, required: true },
        // phoneNumber: { type: String, required: true },
        schoolName: { type: String, required: true },
        class: { type: String, required: true },
        section: { type: String, required: true },
        gender: { type: String, required: true },
        stream: { type: String, required: false }, // required only for 11/12
        parentName: { type: String, required: true },
        parentContact: { type: String, required: true },
        schoolBranch: { type: String, required: true },
        schoolAddress: { type: String, required: true },
        region: { type: String, required: true },
    },
    { timestamps: true }
);

delete mongoose.models.EoiStudent;
export const EoiStudent =
    mongoose.models.EoiStudent || mongoose.model<IEoiStudent>("EoiStudent", eoiStudentSchema);