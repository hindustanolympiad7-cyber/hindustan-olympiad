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

interface StudentFormData {
  name: string;
  phoneNumber: string;
  schoolName: string;
  class: string;
  district: string;
}

export default function StudentRegistrationPage() {
  const [region, setRegion] = useState("");
  const [studentForm, setStudentForm] = useState<StudentFormData>({
    name: "",
    phoneNumber: "",
    schoolName: "",
    district: "",
    class: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { success, error } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!region || !studentForm.district || !studentForm.name || !studentForm.phoneNumber || !studentForm.schoolName) {
      error("All fields are required!", { duration: 3000, position: "top-right" });
      setIsSubmitting(false);
      return;
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(studentForm.phoneNumber)) {
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
        setStudentForm({ name: "", phoneNumber: "", schoolName: "", district: "", class: "" });
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
              Please select your Region and District to proceed.
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
                  <Label>Your Name</Label>
                  <Input value={studentForm.name} onChange={(e) => setStudentForm((p) => ({ ...p, name: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Your Contact Number</Label>
                  <Input value={studentForm.phoneNumber} onChange={(e) => setStudentForm((p) => ({ ...p, phoneNumber: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>School Name</Label>
                  <Input value={studentForm.schoolName} onChange={(e) => setStudentForm((p) => ({ ...p, schoolName: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Class</Label>
                  <Input value={studentForm.class} onChange={(e) => setStudentForm((p) => ({ ...p, class: e.target.value }))} />
                </div>
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
