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
// Payment Modal
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import router from "next/router";
import { IndiviualStudent } from "@/utils/models/indiviualStudents";



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
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { success, error } = useToast();
  const [openPopup, setOpenPopup] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    console.log("Validation data:", studentForm);
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
      !studentForm.schoolAddress 
    ) {
      error("All fields are required!", { duration: 3000, position: "top-right" });
      setIsSubmitting(false);
      return;
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(studentForm.parentContact)) {
      error("Invalid phone number!", { duration: 3000, position: "top-right" });
      setIsSubmitting(false);
      return;
    }
    // ✅ Backend call to init student
    const res = await fetch("/api/eoi/student/jwt-token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...studentForm, region }),
    });

    const data = await res.json();

    if (!res.ok) {
      error(data.error || "Failed to init", { duration: 3000 });
      setIsSubmitting(false);
      return;
    }

    // ✅ StudentId + Token mil gaye, ab store kar lo
    setStudentForm((prev) => ({
      ...prev,
      studentId: data.studentId,
      token: data.token,
    }));
    localStorage.setItem("jwtToken", data.token);
    localStorage.setItem("studentId", data.studentId);
    console.log("Received studentId and token:", data);
    setOpenPopup(true);    
  };

  // Start Payment Process
  const startPayment = async () => {
    // localStorage for token aur studentId
    const token = localStorage.getItem("jwtToken");  
    const studentId = localStorage.getItem("studentId");  

    if (!token || !studentId) {
      console.error("Token or Student ID missing!");
      return;
    }
    // Step 1: Call their backend order API
    try {
      // 1️⃣ Create Payment Order first
      const orderRes = await fetch("http://10.136.174.242:3000/olampiyad/paymentorder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token,
        },
        body: JSON.stringify({
          amount: 250, // Rs. 250.00 
          studentId: studentId, 
          service: "olympiad-backend",
        }),
      });

      if (!orderRes.ok) {
        throw new Error("Payment order creation failed");
      }

      const orderData = await orderRes.json();
      const { orderId, transactionId } = orderData;

      // 2️⃣ On Payment Success → Verify payment
      const verifyRes = await fetch("http://10.136.174.242:3000/olampiyad/verify-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token,
        },
        body: JSON.stringify({
          order: orderId,
          studentId: studentId,
          transactionId: transactionId,
        }),
      });

      if (!verifyRes.ok) {
        throw new Error("Payment verification failed");
      }

      const verifyData = await verifyRes.json();

      if (verifyData.status === "success") {
        // 3️⃣ Now create student entry in your DB
        const res = await fetch("/api/eoi/student", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...studentForm,
            region,
            orderId,
            transactionId,
          }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Student creation failed after payment");
        }

        const data = await res.json();
        const studentId = data.student.studentId;

        // 4️⃣ Send SMS to parent
        await fetch("/api/eoi/student/parent-sms", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            phoneNumber: studentForm.parentContact,
            studentId,
          }),
        });

        success("Registration & Payment Successful!", {
          position: "top-right",
          duration: 2000,
        });

        // Reset form
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
        });
        setRegion("");
        // 5️⃣ Redirect to Thank You page with student + payment info
        router.push(`/thank-you?studentId=${studentId}&orderId=${orderId}`);
      } else {
        throw new Error("Payment not verified");
      }
    } catch (err: any) {
      error("Something went wrong!", {
        duration: 3000,
        description: err.message,
      });
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
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit Details"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
      <Dialog open={openPopup} onOpenChange={setOpenPopup}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Details & Make Payment</DialogTitle>
          </DialogHeader>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 pb-2">
            <div className="space-y-2">
              <Label>Student Name</Label>
              <Input value={studentForm.name} readOnly />
            </div>
            <div className="space-y-2">
              <Label>Class</Label>
              <Input value={studentForm.class} readOnly />
            </div>
            <div className="space-y-2">
              <Label>Parent Name</Label>
              <Input value={studentForm.parentName} readOnly />
            </div>
            <div className="space-y-2">
              <Label>Parent Contact</Label>
              <Input value={studentForm.parentContact} readOnly />
            </div>
          </div>
          <DialogFooter className="flex justify-between mt-4">
            <Button variant="outline" onClick={() => setOpenPopup(false)}>
              Close
            </Button>
            <Button onClick={startPayment}>
              Make Payment
            </Button>
          </DialogFooter>
      </DialogContent>
    </Dialog>

    </div>
  );
}
// ...existing code...