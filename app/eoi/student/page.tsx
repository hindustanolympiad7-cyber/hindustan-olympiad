"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

// Region → District mapping
const regionDistrictMap: Record<string, { value: string; label: string }[]> = {
  "East UP": [
    { value: "kanpur", label: "Kanpur" },
    { value: "lucknow", label: "Lucknow" },
    { value: "gorakhpur", label: "Gorakhpur" },
    { value: "allahabad", label: "Allahabad" },
    { value: "varanasi", label: "Varanasi" },
  ],
  "West UP": [
    { value: "agra", label: "Agra" },
    { value: "aligarh", label: "Aligarh" },
    { value: "bareilly", label: "Bareilly" },
    { value: "meerut", label: "Meerut" },
    { value: "moradabad", label: "Moradabad" },
  ],
  "Bihar": [
    { value: "patna", label: "Patna" },
    { value: "bhagalpur", label: "Bhagalpur" },
    { value: "muzaffarpur", label: "Muzaffarpur" },
    { value: "gaya", label: "Gaya" },
    { value: "purnea", label: "Purnea" },
  ],
  "Jharkhand": [
    { value: "ranchi", label: "Ranchi" },
    { value: "dhanbad", label: "Dhanbad" },
    { value: "jamshedpur", label: "Jamshedpur" },
  ],
  "Uttarakhand": [
    { value: "haldwani", label: "Haldwani" },
    { value: "dehradun", label: "Dehradun" },
  ],
};

// ...existing code...
interface StudentFormData {
  name: string;
  class: string;
  section: string;
  gender: string;
  stream: string;
  parentName: string;
  parentContact: string;
  schoolName: string;
  schoolBranch: string;
  schoolAddress: string;
  district: string;
  phoneNumber: string;
}

export default function StudentRegistrationPage() {
  const [region, setRegion] = useState("");
  const [studentForm, setStudentForm] = useState<StudentFormData>({
    name: "",
    class: "",
    section: "",
    gender: "",
    stream: "",
    parentName: "",
    parentContact: "",
    schoolName: "",
    schoolBranch: "",
    schoolAddress: "",
    district: "",
    phoneNumber: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { success, error } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Basic validation
    if (
      !region ||
      !studentForm.district ||
      !studentForm.name ||
      !studentForm.class ||
      !studentForm.section ||
      !studentForm.gender ||
      (["11", "12"].includes(studentForm.class) && !studentForm.stream) ||
      !studentForm.parentName ||
      !studentForm.parentContact ||
      !studentForm.schoolName ||
      !studentForm.schoolBranch ||
      !studentForm.schoolAddress ||
      !studentForm.phoneNumber
    ) {
      error("All fields are required!", { duration: 3000, position: "top-right" });
      setIsSubmitting(false);
      return;
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(studentForm.phoneNumber) || !phoneRegex.test(studentForm.parentContact)) {
      error("Invalid phone number!", { duration: 3000, position: "top-right" });
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch("/api/eoi/student", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...studentForm, region }),
      });
      if (res.ok) {
        success("Registration successful!", { position: "top-right", duration: 2000 });
        setStudentForm({
          name: "",
          class: "",
          section: "",
          gender: "",
          stream: "",
          parentName: "",
          parentContact: "",
          schoolName: "",
          schoolBranch: "",
          schoolAddress: "",
          district: "",
          phoneNumber: "",
        });
        setRegion("");
      } else {
        const data = await res.json();
        throw new Error(data.error || "Submission failed");
      }
    } catch (err: any) {
      error("Something went wrong!", { duration: 3000, description: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link href="/#participate">
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardDescription className="text-base font-medium text-black">
              The exam would be conducted in select cities only, students will have to arrange for their own travel. Kindly select your State and city of preference, exam centres will be allotted accordingly.
            </CardDescription>
          </CardHeader>

          <CardContent>
            {/* Region */}
            <div className="space-y-2 mb-4">
              <Label htmlFor="region">Region</Label>
              <Select value={region} onValueChange={(val) => { setRegion(val); setStudentForm((prev) => ({ ...prev, district: "" })); }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(regionDistrictMap).map((reg) => (
                    <SelectItem key={reg} value={reg}>
                      {reg}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* District */}
            {region && (
              <div className="space-y-2 mb-4">
                <Label htmlFor="district">District</Label>
                <Select
                  value={studentForm.district}
                  onValueChange={(value) => setStudentForm((prev) => ({ ...prev, district: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select district" />
                  </SelectTrigger>
                  <SelectContent>
                    {regionDistrictMap[region]?.map((district) => (
                      <SelectItem key={district.value} value={district.value}>
                        {district.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Form fields */}
            {region && studentForm.district && (
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label>Student Name</Label>
                  <Input value={studentForm.name} onChange={(e) => setStudentForm((p) => ({ ...p, name: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Class</Label>
                  <Select
                    value={studentForm.class}
                    onValueChange={(value) => setStudentForm((p) => ({ ...p, class: value, stream: "" }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 12 }, (_, i) => (
                        <SelectItem key={i + 1} value={(i + 1).toString()}>
                          {i + 1}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {/* Stream field for class 11/12 */}
                {(studentForm.class === "11" || studentForm.class === "12") && (
                  <div className="space-y-2">
                    <Label htmlFor="stream">Stream</Label>
                    <Select
                      value={studentForm.stream}
                      onValueChange={(value) => setStudentForm((p) => ({ ...p, stream: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select stream" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PCB">PCB</SelectItem>
                        <SelectItem value="PCM">PCM</SelectItem>
                        <SelectItem value="COMM">Commerce with Maths</SelectItem>
                        <SelectItem value="COMW">Commerce without Maths</SelectItem>
                        <SelectItem value="ARTS">Humanities</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <div className="space-y-2">
                  <Label>Section</Label>
                  <Input value={studentForm.section} onChange={(e) => setStudentForm((p) => ({ ...p, section: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Gender</Label>
                  <Select
                    value={studentForm.gender}
                    onValueChange={(value) => setStudentForm((p) => ({ ...p, gender: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>                
                <div className="space-y-2">
                  <Label>Parent Name</Label>
                  <Input value={studentForm.parentName} onChange={(e) => setStudentForm((p) => ({ ...p, parentName: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Parent Contact Number</Label>
                  <Input value={studentForm.parentContact} onChange={(e) => setStudentForm((p) => ({ ...p, parentContact: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>School Name</Label>
                  <Input value={studentForm.schoolName} onChange={(e) => setStudentForm((p) => ({ ...p, schoolName: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>School Branch</Label>
                  <Input value={studentForm.schoolBranch} onChange={(e) => setStudentForm((p) => ({ ...p, schoolBranch: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>School Address</Label>
                  <Input value={studentForm.schoolAddress} onChange={(e) => setStudentForm((p) => ({ ...p, schoolAddress: e.target.value }))} />
                </div>
                {/* <div className="space-y-2">
                  <Label>Your Contact Number</Label>
                  <Input value={studentForm.phoneNumber} onChange={(e) => setStudentForm((p) => ({ ...p, phoneNumber: e.target.value }))} />
                </div> */}
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit Details"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
// ...existing code...