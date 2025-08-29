// utils/generateStudentId.ts
import { IndiviualStudent } from "@/utils/models/indiviualStudents";

const regionCodes: Record<string, string> = {
  "East UP": "1",
  "West UP": "2",
  "Bihar": "3",
  "Jharkhand": "4",
  "Uttarakhand": "5",
};

const districtCodes: Record<string, Record<string, string>> = {
  "East UP": { kanpur: "01", lucknow: "02", gorakhpur: "03", allahabad: "04", varanasi: "05" },
  "West UP": { agra: "01", aligarh: "02", bareilly: "03", meerut: "04", moradabad: "05" },
  "Bihar": { patna: "01", bhagalpur: "02", muzaffarpur: "03", gaya: "04", purnea: "05" },
  "Jharkhand": { ranchi: "01", dhanbad: "02", jamshedpur: "03" },
  "Uttarakhand": { haldwani: "01", dehradun: "02" },
};

export async function generateStudentId(region: string, district: string) {
  const regionCode = regionCodes[region] || "9";
  const districtCode = districtCodes[region]?.[district] || "99";

  const lastStudent = await IndiviualStudent.findOne().sort({ createdAt: -1 });
  let uniqueNumber = "00000001";

  if (lastStudent?.studentId) {
    const lastUnique = parseInt(lastStudent.studentId.slice(-8), 10);
    uniqueNumber = (lastUnique + 1).toString().padStart(8, "0");
  }

  return `${regionCode}${districtCode}${uniqueNumber}`;
}
